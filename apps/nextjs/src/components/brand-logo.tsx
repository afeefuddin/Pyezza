import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  inverted = false,
  priority = false,
}: {
  className?: string;
  inverted?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={inverted ? "/brand/pyezza-logo-light.svg" : "/brand/pyezza-logo.svg"}
      alt="Pyezza"
      width={840}
      height={244}
      className={cn("block h-10 w-auto shrink-0", className)}
      priority={priority}
      unoptimized
    />
  );
}

export function BrandIcon({
  className,
  alt = "Pyezza",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <Image
      src="/brand/pyezza-square.svg"
      alt={alt}
      width={360}
      height={360}
      className={cn("block size-10 shrink-0 rounded-md", className)}
      unoptimized
    />
  );
}
