import { LoaderFunctionArgs, redirect, json } from '@remix-run/node';
import { kv } from '@vercel/kv';
import { getSession } from '~/auth';
import { getUserMedia } from '~/instaApi';
import { Media } from './first-post';

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
      firstPost: firstPostFromKv,
      intermediatePost: null,
      afterCursor: null,
    });
  }

  const url = new URL(request.url);
  const afterCursor = url.searchParams.get('afterCursor');

  const limitForAtLeastFourPosts =
    user.mediaCount >= 4 ? Math.floor(user.mediaCount / 4) : user.mediaCount;
  const limit = limitForAtLeastFourPosts > 100 ? 100 : limitForAtLeastFourPosts;

  try {
    const userMediaData = await getUserMedia({
      userId: user.id,
      accessToken,
      afterCursor,
      limit,
    });
    const { hasMore } = userMediaData;

    const lastPostInList = userMediaData.data[userMediaData.data.length - 1];
    const randomIndex = Math.floor(Math.random() * userMediaData.data.length);
    const randomPost = userMediaData.data[randomIndex];

    if (!hasMore && lastPostInList) {
      await kv.set(`${user.id}-first-post`, lastPostInList, { ex: 60 * 30 }); // 30 minutes
    }

    return json({
      firstPost: !hasMore ? lastPostInList : null,
      intermediatePost: hasMore ? randomPost : null,
      afterCursor: hasMore ? userMediaData.afterCursor : null,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user media');
  }
}
