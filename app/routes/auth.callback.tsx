import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { kv } from '@vercel/kv';
import { commitSession, getSession } from '~/auth';

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID ?? '';
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET ?? '';
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI ?? '';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('No code found', { status: 400 });
  }

  const formData = new FormData();

  formData.append('client_id', INSTAGRAM_APP_ID);
  formData.append('client_secret', INSTAGRAM_APP_SECRET);
  formData.append('grant_type', 'authorization_code');
  formData.append('redirect_uri', INSTAGRAM_REDIRECT_URI);
  formData.append('code', code);

  const res = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  const { access_token, user_id } = data;

  const userRes = await fetch(
    `https://graph.instagram.com/${user_id}?fields=id,username,media_count&access_token=${access_token}`
  );

  const userData = await userRes.json();

  const session = await getSession(request.headers.get('Cookie'));

  const user = {
    id: userData.id,
    username: userData.username,
    mediaCount: userData.media_count,
  };

  session.set('auth', JSON.stringify(user));

  kv.set(user.id, access_token);

  return redirect('/first-post', {
    headers: {
      'Set-Cookie': await commitSession(session, {
        expires: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
      }),
    },
  });
}
