import { Media } from '~/routes/first-post';

export default function Polaroid({
  media,
  width,
}: {
  media: Media;
  width: number;
}) {
  const { thumbnail_url, media_url, caption, permalink } = media;

  return (
    <a
      href={permalink}
      target="_blank"
      rel="noreferrer"
      className="shadow-xl bg-white rounded px-4 pt-7 gap-4 flex flex-col border"
      style={{
        width: `${width}px`,
      }}
    >
      <figure>
        <img
          className="w-full"
          src={thumbnail_url ?? media_url}
          alt={caption}
        />
      </figure>
      <div className="flex px-4 pb-4">
        {caption && (
          <p>
            {caption.substring(0, 200)}
            {caption.length > 200 ? '...' : ''}
          </p>
        )}
      </div>
    </a>
  );
}
