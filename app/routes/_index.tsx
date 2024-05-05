import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import qs from 'qs';
import { json, redirect } from '@remix-run/node';
import { getSession } from '~/auth';

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID ?? '';
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI ?? '';

export const meta: MetaFunction = () => {
  return [
    { title: 'MyFirstInstaPost' },
    { name: 'description', content: 'Find your first Instagram post' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const auth = session.get('auth');

  if (auth) {
    const user = JSON.parse(auth);

    if (user?.id) {
      return redirect('/first-post');
    }
  }

  const url = new URL(request.url);
  const authError = url.searchParams.get('authError');
  const error = url.searchParams.get('error');

  if (authError) {
    return json({ authError, error: null });
  }

  if (error) {
    return json({ error, authError: null });
  }

  return json({ authError: null, error: null });
}

export function action() {
  const baseUrl = 'https://api.instagram.com/oauth/authorize';
  const queryString = qs.stringify({
    client_id: INSTAGRAM_APP_ID,
    redirect_uri: INSTAGRAM_REDIRECT_URI,
    scope: 'user_profile,user_media',
    response_type: 'code',
  });

  return redirect(`${baseUrl}?${queryString}`);
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const error = loaderData?.error;
  const authError = loaderData?.authError;

  return (
    <div className="h-screen w-screen flex flex-col items-center gap-8">
      <div className="flex items-center flex-col gap-1">
        <h1 className="text-center text-3xl font-bold">MyFirstInstaPost</h1>
        <p>Find your first Instagram post.</p>
      </div>
      <Form method="post">
        <button
          type="submit"
          className="border rounded-md px-6 py-2 bg-slate-700 text-white font-bold text-lg"
        >
          Let{"'"}s find it 🚀
        </button>
      </Form>
      {authError && authError === 'user_denied' && (
        <p className="text-red-500 text-center mx-auto max-w-1/2">
          Oops, looks like you decided not to allow scrolling through your
          posts. That{"'"}s cool. You can try again if you want.
        </p>
      )}
      {authError && authError === 'server_error' && (
        <p className="text-red-500 text-center mx-auto max-w-1/2">
          Something is wrong on our end. We{"'"}ll look into it. Sorry about
          that.
        </p>
      )}
      {error && (
        <p className="text-red-500 text-center mx-auto max-w-1/2">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
