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
import { useEffect, useMemo, useState } from 'react';
import Polaroid from '~/components/Polaroid';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';

const phrases = [
  'Check this one out',
  'Or this one',
  "Oh, that's a nice one",
  "Isn't this one amazing?",
  "This one's really cool",
  'How about this one?',
  "This one's worth a look",
  "Don't miss this one",
  "This one's a gem",
  "You'll love this one",
  "This one's a keeper",
  'Take a look at this one',
  "This one's a showstopper",
  "This one's a crowd pleaser",
  "This one's a favorite",
  "This one's a winner",
  "This one's a masterpiece",
  "This one's a beauty",
  "This one's a stunner",
  "This one's a dazzler",
];

function getRandomPhrase() {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

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

  const intermediatePostPhrase = useMemo(
    () => getRandomPhrase(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [intermediatePost]
  );

  const [intermediatePosts, setIntermediatePosts] = useState<Media[]>([]);

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
      setTimeout(() => {
        fetcher.load(`/api/posts?afterCursor=${data.afterCursor}`);
      }, 350);
    }
  }, [data?.afterCursor, fetcher, firstPost, intermediatePost, state]);

  useEffect(
    function captureIntermediatePosts() {
      if (intermediatePost) {
        const intermediatePostExists = intermediatePosts.some(
          (post) => post.id === intermediatePost.id
        );

        if (intermediatePostExists) {
          return;
        }

        setIntermediatePosts((prev) => [...prev, intermediatePost]);
      }
    },
    [intermediatePost, intermediatePosts]
  );

  return (
    <div className="flex flex-col py-8 px-8 gap-12">
      {!firstPost && (
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-center">
            Scrolling back to your first post
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
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-center">
                {intermediatePostPhrase}
              </h2>
              <div className="flex justify-center">
                <LazyMotion features={domAnimation}>
                  <AnimatePresence mode="wait">
                    {intermediatePost?.permalink && (
                      <m.div
                        initial={{
                          transform: 'translateX(-100%) rotate(-20deg)',
                          opacity: 0,
                        }}
                        animate={{
                          transform: 'translateX(0) rotate(0)',
                          opacity: 1,
                        }}
                        exit={{
                          transform: 'translateX(100%) rotate(20deg)',
                          opacity: 0,
                        }}
                        key={intermediatePost?.id}
                      >
                        <Polaroid media={intermediatePost} width={300} />
                      </m.div>
                    )}
                  </AnimatePresence>
                </LazyMotion>
              </div>
            </div>
          )}
        </div>
      )}

      {firstPost && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col ">
              <h1 className="text-5xl font-bold text-center">
                Your First Post
              </h1>
              <p className="text-sm text-center">
                of {numPosts} Post{numPosts > 1 ? 's' : ''}
              </p>
            </div>
            <form method="post" className="flex justify-center">
              <button
                type="submit"
                className="border border-theme-burgundy rounded-md px-3 py-1 bg-white text-xs"
              >
                Let{"'"}s scroll through again!
              </button>
            </form>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Polaroid media={firstPost} width={400} />
            {intermediatePosts.length > 0 && (
              <p className="text-xs text-center">Memories 👇</p>
            )}
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {intermediatePosts.map((post) => (
              <div key={post.id}>
                <Polaroid
                  media={post}
                  width={150}
                  captionLength={80}
                  captionTextClassName="text-xs"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
