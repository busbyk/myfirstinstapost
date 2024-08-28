import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import qs from 'qs';
import { json, redirect } from '@remix-run/node';
import { getSession } from '~/auth.server';

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
    <div className="flex flex-col gap-20 pt-8 px-8 items-center">
      <div className="flex flex-col gap-8">
        <div className="w-full">
          <h1 className="text-5xl sm:text-7xl font-bold">
            Find Your <br className="sm:hidden" />
            First <br className="hidden sm:inline" /> Post
            <br className="sm:hidden" /> On Instagram
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <p>
            Scrolling through your whole feed to find your first post can be
            annoying 😴
          </p>
          <p>
            We{"'"}ll scroll through for you and take a stroll down memory lane
            while we{"'"}re at it!
          </p>
        </div>
      </div>
      <Form method="post" className="flex flex-col gap-2 w-fit">
        <button
          type="submit"
          className="border-theme-burgundy border rounded-md px-12 py-4 bg-theme-blue text-white font-bold text-2xl sm:text-4xl"
        >
          Let{"'"}s find it <span className="ml-1">🚀</span>
        </button>
        <p className="text-xs max-w-max mx-auto text-gray-700">
          This will redirect you to Instagram to grant <br />
          us permission to scroll through your feed.
        </p>
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
      {authError && authError === 'instagram_is_transient_error' && (
        <p className="text-red-500 text-center mx-auto max-w-1/2">
          Instagram sent back an undocumented error requesting you to try again
          later 🤦‍♂️
        </p>
      )}
      {authError && authError === 'permissions_error' && (
        <div className="flex flex-col gap-2">
          <p className="text-red-500 text-center mx-auto max-w-1/2">
            It looks like you didn{"'"}t grant us permission to scroll through
            your posts.
          </p>
          <p className="text-red-500 text-center mx-auto max-w-1/2">
            If this was by mistake and you want to try again, make sure you have
            the{' '}
            <span className="font-bold text-lg">
              {'"'}Content (Optional){'"'}
            </span>{' '}
            permission checked.
          </p>
        </div>
      )}
      {error && (
        <p className="text-red-500 text-center mx-auto max-w-1/2">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
