import { LoaderFunctionArgs, defer, json, redirect } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
import { getSession } from '~/auth';
import { getFirstPost } from '~/instaApi';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const auth = session.get('auth');

  if (!auth) {
    // session flash?
    return redirect('/');
  }

  const user = JSON.parse(auth);

  // const firstPostFromSession = session.get('firstPost');

  // if (firstPostFromSession) {
  //   console.log('got it from sesh');
  //   return json({
  //     firstPost: JSON.parse(firstPostFromSession),
  //     numPosts: user.mediaCount,
  //   });
  // }

  const firstPostPromise = getFirstPost({
    userId: user.id,
    accessToken: user.access_token,
  });

  // session.set('firstPost', JSON.stringify(firstPost));

  return defer({ firstPostPromise, numPosts: user.mediaCount });
}

export default function FirstPost() {
  const { firstPostPromise, numPosts } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-8">
      <Suspense
        fallback={<div>Scrolling through all your posts for you...</div>}
      >
        <Await resolve={firstPostPromise} errorElement={<div>Oops!</div>}>
          {(firstPost) => (
            <>
              <h1 className="text-3xl font-bold text-center">
                Your First Post of {numPosts} Post{numPosts > 1 ? 's' : ''}:
              </h1>
              <div className="flex justify-center">
                {firstPost?.permalink && (
                  <InstagramEmbed
                    url={firstPost?.permalink}
                    width={400}
                    captioned
                  />
                )}
              </div>
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
