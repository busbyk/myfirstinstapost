import { LoaderFunctionArgs, defer, redirect } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { kv } from '@vercel/kv';
import { Suspense } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
import { getSession } from '~/auth';
import { getFirstPost } from '~/instaApi';

export type FirstPost = {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail: string;
  caption: string;
  timestamp: string;
  permalink: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const auth = session.get('auth');

  if (!auth) {
    // TODO session flash?
    return redirect('/');
  }

  const user = JSON.parse(auth);

  const accessToken = await kv.get<string>(user.id);

  if (!accessToken) {
    // TODO session flash?
    return redirect('/');
  }

  const firstPostFromKv = await kv.get<FirstPost>(`${user.id}-first-post`);

  if (firstPostFromKv) {
    return defer({
      firstPostPromise: Promise.resolve(firstPostFromKv),
      numPosts: user.mediaCount,
    });
  }

  const firstPostPromise = getFirstPost({
    userId: user.id,
    accessToken,
  }).then((firstPost) => {
    kv.set(`${user.id}-first-post`, firstPost, { ex: 60 * 10 }); // 10 minutes
    return firstPost;
  });

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
