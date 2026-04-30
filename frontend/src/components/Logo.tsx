import Image from "next/image";
import Link from "next/link";

export function Logo({
  size = 44,
  asLink = true,
  variant = "dark",
}: {
  size?: number;
  asLink?: boolean;
  variant?: "dark" | "light";
}) {
  const src =
    variant === "light" ? "/gjej-pro-logo-light.png" : "/gjej-pro-logo.png";

  const img = (
    <Image
      src={src}
      alt="Gjej Pro"
      width={500}
      height={250}
      priority
      style={{ height: size, width: "auto" }}
    />
  );

  if (!asLink) return img;

  return (
    <Link href="/" className="inline-flex items-center group">
      {img}
    </Link>
  );
}
