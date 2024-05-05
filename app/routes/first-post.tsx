import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { kv } from '@vercel/kv';
import { InstagramEmbed } from 'react-social-media-embed';
import { getSession } from '~/auth';
import { loader as postsLoader } from './api.posts';
import { useEffect } from 'react';
import Polaroid from '~/components/Polaroid';

export type Media = {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
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

  const firstPostFromKv = await kv.get<Media>(`${user.id}-first-post`);

  if (firstPostFromKv) {
    return json({
      firstPostFromCache: firstPostFromKv,
      numPosts: user.mediaCount,
    });
  }

  return json({
    firstPostFromCache: null,
    numPosts: user.mediaCount,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const auth = session.get('auth');

  if (!auth) {
    return redirect('/');
  }

  const user = JSON.parse(auth);

  return kv.set(`${user.id}-first-post`, null);
}

export default function FirstPost() {
  const { firstPostFromCache, numPosts } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof postsLoader>();
  const { data, state } = fetcher;

  const firstPost = data?.firstPost || firstPostFromCache;
  const intermediatePost = data?.intermediatePost;

  useEffect(() => {
    if (state === 'idle' && !data) {
      fetcher.load('/api/posts');
    }
  }, [data, fetcher, state]);

  useEffect(() => {
    if (
      !firstPost &&
      intermediatePost &&
      state === 'idle' &&
      data?.afterCursor
    ) {
      fetcher.load(`/api/posts?afterCursor=${data.afterCursor}`);
    }
  }, [data?.afterCursor, fetcher, firstPost, intermediatePost, state]);

  return (
    <div className="flex flex-col gap-8">
      {!firstPost && (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-center">
            Loading your first post
            <div className="animate-[bounce_1s_infinite] inline-block text-4xl ml-0.5">
              .
            </div>
            <div className="animate-[bounce_1s_infinite_100ms] inline-block text-4xl">
              .
            </div>
            <div className="animate-[bounce_1s_infinite_150ms] inline-block text-4xl">
              .
            </div>
          </h1>
          {intermediatePost && (
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-center">
                Not this one... continuing to scroll
              </h2>
              <div className="flex justify-center">
                {intermediatePost?.permalink && (
                  <Polaroid
                    media={intermediatePost}
                    key={intermediatePost?.id}
                    width={300}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {firstPost && (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-center">
              Your First Post of {numPosts} Post{numPosts > 1 ? 's' : ''}
            </h1>
            <form method="post" className="flex justify-center">
              <button
                type="submit"
                className="border rounded-md px-3 py-1 bg-white text-xs"
              >
                Let{"'"}s scroll through again 😊!
              </button>
            </form>
          </div>
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
    </div>
  );
}
