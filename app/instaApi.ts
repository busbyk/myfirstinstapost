export async function getFirstPost({
  userId,
  accessToken,
  nextUrl,
}: {
  userId: string;
  accessToken: string;
  nextUrl?: string;
}) {
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
