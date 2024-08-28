import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { kv } from '@vercel/kv';
import { commitSession, getSession } from '~/auth.server';
import { encrypt } from '~/crypto.server';

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID ?? '';
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET ?? '';
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI ?? '';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const errorReason = url.searchParams.get('error_reason');

  if (!code) {
    if (error) {
      return redirect(`/?authError=${errorReason}`);
    } else {
      return new Response('No code found', { status: 400 });
    }
  }

  const formData = new FormData();

  formData.append('client_id', INSTAGRAM_APP_ID);
  formData.append('client_secret', INSTAGRAM_APP_SECRET);
  formData.append('grant_type', 'authorization_code');
  formData.append('redirect_uri', INSTAGRAM_REDIRECT_URI);
  formData.append('code', code);

  try {
    const res = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    const { access_token, user_id } = data;

    if (!access_token || !user_id) {
      return redirect('/?authError=server_error');
    }

    const userRes = await fetch(
      `https://graph.instagram.com/${user_id}?fields=id,username,media_count&access_token=${access_token}`
    );

    const { id, username, media_count, error } = await userRes.json();

    if (error) {
      console.error(
        `Error fetching user profile: ${error.message}. Code: ${error.code}.`
      );
      console.error(error);
      if (error.code === 10) {
        return redirect('/?authError=permissions_error');
      }
      if (error.code === 2) {
        return redirect('/?authError=instagram_is_transient_error');
      }
      return redirect('/?authError=server_error');
    }

    const session = await getSession(request.headers.get('Cookie'));

    const user = {
      id,
      username,
      mediaCount: media_count,
    };

    session.set('auth', JSON.stringify(user));

    kv.set(user.id, encrypt(access_token), { ex: 60 * 30 }); // 30 minutes

    return redirect('/first-post', {
      headers: {
        'Set-Cookie': await commitSession(session, {
          expires: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
        }),
      },
    });
  } catch (error) {
    console.error(error);
    return redirect('/?error=unknown_error');
  }
}

export default function AuthCallback() {
  return <div />;
}
