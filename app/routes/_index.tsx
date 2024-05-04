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
    <div className="h-screen w-screen flex justify-center">
      <h1 className="color-red-500">MyFirstInstaPost</h1>
      <p>Find your first Instagram post.</p>
      <Form method="post">
        <button type="submit">Find it!</button>
      </Form>
    </div>
  );
}
