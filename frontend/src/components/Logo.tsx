import Image from "next/image";
import Link from "next/link";

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 group">
      <Image
        src="/gjej-pro-logo.png"
        alt="Gjej Pro"
        width={size * 2.4}
        height={size}
        priority
        className="h-auto w-auto"
        style={{ height: size }}
      />
    </Link>
  );
}
