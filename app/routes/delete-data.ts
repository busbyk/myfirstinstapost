import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { kv } from '@vercel/kv';
import { destroySession, getSession } from '~/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const auth = session.get('auth');

  if (!auth) {
    // TODO session flash?
    return redirect('/');
  }

  const user = JSON.parse(auth);

  await kv.set(user.id, null);
  await kv.set(`${user.id}-first-post`, null);

  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}
