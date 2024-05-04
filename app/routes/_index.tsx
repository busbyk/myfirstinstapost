import type { MetaFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';
import qs from 'qs';
import { redirect } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'MyFirstInstaPost' },
    { name: 'description', content: 'Find your first Instagram post' },
  ];
};

export function action() {
  const baseUrl = 'https://api.instagram.com/oauth/authorize';
  const queryString = qs.stringify({
    client_id: process.env.INSTAGRAM_APP_ID,
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
    scope: 'user_profile,user_media',
    response_type: 'code',
  });

  return redirect(`${baseUrl}?${queryString}`);
}

export default function Index() {
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
          Find it!
        </button>
      </Form>
    </div>
  );
}
