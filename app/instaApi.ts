import { Media } from './routes/first-post';

export async function getFirstPost({
  userId,
  accessToken,
  nextUrl,
}: {
  userId: string;
  accessToken: string;
  nextUrl?: string;
}): Promise<{
  id: string;
  media_type: string;
  media_url: string;
  thumbnail: string;
  caption: string;
  timestamp: string;
  permalink: string;
} | null> {
  console.log('fetching');
  const userMediaRes = await fetch(
    nextUrl ??
      `https://graph.instagram.com/${userId}/media?fields=id&access_token=${accessToken}&limit=100`
  );

  const userMediaData = await userMediaRes.json();

  const { data, paging } = userMediaData;

  if (!paging.next) {
    const firstPostObj = data[data.length - 1];

    const firstPostDetail = await getMediaDetail({
      mediaId: firstPostObj.id,
      accessToken,
    });

    return firstPostDetail;
  }

  const next = paging.next;

  return getFirstPost({ userId, accessToken, nextUrl: next });
}

export async function getUserMedia({
  userId,
  accessToken,
  afterCursor,
  limit = 100,
}: {
  userId: string;
  accessToken: string;
  afterCursor?: string | null;
  limit?: number;
}): Promise<{
  data: Media[];
  afterCursor: string | null;
  hasMore: boolean;
}> {
  const userMediaRes = await fetch(
    `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,thumbnail_url,caption,timestamp,permalink&access_token=${accessToken}&limit=${limit}${
      afterCursor ? `&after=${afterCursor}` : ''
    }`
  );

  const json = await userMediaRes.json();
  const { data, paging } = json;

  return {
    data,
    afterCursor: paging?.cursors?.after,
    hasMore: !!paging?.next,
  };
}

export async function getMediaDetail({
  mediaId,
  accessToken,
}: {
  mediaId: string;
  accessToken: string;
}) {
  const mediaRes = await fetch(
    `https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,caption,timestamp,permalink&access_token=${accessToken}`
  );

  return await mediaRes.json();
}
