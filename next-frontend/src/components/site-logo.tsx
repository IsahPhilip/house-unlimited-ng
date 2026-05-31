import Image from "next/image";

const LOGO_SIZES = {
  header: { width: 320, height: 96 },
  footer: { width: 240, height: 72 },
  compact: { width: 160, height: 48 }
} as const;

type SiteLogoProps = {
  alt: string;
  variant?: keyof typeof LOGO_SIZES;
  priority?: boolean;
  className?: string;
};

export function SiteLogo({
  alt,
  variant = "header",
  priority = false,
  className
}: SiteLogoProps) {
  return (
    <Image
      src="/hun_logo.png"
      alt={alt}
      width={LOGO_SIZES[variant].width}
      height={LOGO_SIZES[variant].height}
      priority={priority}
      className={className}
    />
  );
}
