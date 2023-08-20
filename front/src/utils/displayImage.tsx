const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  src: string | undefined;
  alt: string;
  className?: string;
}

const DisplayImg = ({ src, alt, className }: Props) => {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  if (!src?.match(urlRegex) && src !== 'pong-nav.png')
    src = API_URL + '/avatars/' + src;

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={e => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = API_URL + '/avatars/defaultAvatar.png';
      }}
    />
  );
};

export default DisplayImg;
