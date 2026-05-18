import Image from "next/image";
import hunLogo from "../../../frontend/src/img/hun_logo.png";

const LOGO_SIZES = {
  header: "260px",
  footer: "160px",
  compact: "100px"
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
      src={hunLogo}
      alt={alt}
      width={hunLogo.width}
      height={hunLogo.height}
      sizes={LOGO_SIZES[variant]}
      priority={priority}
      className={className}
    />
  );
}
