import Image, { type StaticImageData } from "next/image";

export const IMAGE_SIZES = {
  gridCard: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  hero: "100vw",
  halfViewport: "(max-width: 1024px) 100vw, 50vw",
  teamCard: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  propertyMain: "(max-width: 1024px) 100vw, 66vw",
  propertyThumb: "(max-width: 768px) 50vw, 200px",
  articleFeatured: "(max-width: 768px) 100vw, 768px",
  ctaBackground: "(max-width: 1024px) 100vw, 1280px",
  videoCard: "420px",
  avatarSm: "32px",
  avatarMd: "80px",
  avatarLg: "96px"
} as const;

type OptimizedImageProps = {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

export function OptimizedImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  fill = true,
  width,
  height
}: OptimizedImageProps) {
  if (!src || (typeof src === "string" && !src.trim())) {
    return null;
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? IMAGE_SIZES.gridCard}
        priority={priority}
        className={className}
      />
    );
  }

  const w = width ?? 96;
  const h = height ?? 96;

  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes ?? `${w}px`}
      priority={priority}
      className={className}
    />
  );
}
