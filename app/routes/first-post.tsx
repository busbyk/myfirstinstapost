import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { InstagramEmbed } from 'react-social-media-embed';
import { commitSession, getSession } from '~/auth';
import { getFirstPost } from '~/instaApi';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const auth = session.get('auth');

  if (!auth) {
    // session flash?
    return redirect('/');
  }

  const user = JSON.parse(auth);

  const firstPostFromSession = session.get('firstPost');

  if (firstPostFromSession) {
    console.log('got it from sesh');
    return json({
      firstPost: JSON.parse(firstPostFromSession),
      numPosts: user.mediaCount,
    });
  }

  const firstPost = await getFirstPost({
    userId: user.id,
    accessToken: user.access_token,
  });

  session.set('firstPost', JSON.stringify(firstPost));

  return json(
    { firstPost, numPosts: user.mediaCount },
    {
      headers: {
        'Set-Cookie': await commitSession(session, {
          expires: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
        }),
      },
    }
  );
}

export default function FirstPost() {
  const { firstPost, numPosts } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center">
        Your First Post of {numPosts} Post{numPosts > 1 ? 's' : ''}:
      </h1>
      <div className="flex justify-center">
        <InstagramEmbed url={firstPost.permalink} width={400} captioned />
      </div>
    </div>
  );
}
