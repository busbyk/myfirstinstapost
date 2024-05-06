import { Media } from '~/routes/first-post';

export default function Polaroid({
  media,
  width,
  captionLength = 200,
  captionTextClassName,
}: {
  media: Media;
  width: number;
  captionLength?: number;
  captionTextClassName?: string;
}) {
  const { thumbnail_url, media_url, caption, permalink } = media;

  return (
    <a
      href={permalink}
      target="_blank"
      rel="noreferrer"
      className="shadow-xl bg-white px-4 pt-7 gap-4 flex flex-col border border-theme-burgundy"
      style={{
        width: `${width}px`,
      }}
    >
      <figure className="shadow-inner">
        <img
          className="w-full"
          src={thumbnail_url ?? media_url}
          alt={caption}
        />
      </figure>
      <div className="flex px-2 pb-6 pt-2">
        {caption && (
          <p className={captionTextClassName ?? ''}>
            {caption.substring(0, captionLength)}
            {caption.length > captionLength ? '...' : ''}
          </p>
        )}
      </div>
    </a>
  );
}
