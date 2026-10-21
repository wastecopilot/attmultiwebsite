import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { BASE_PATH } from "@/data/site";
import { images, type ImageKey } from "@/data/images";

const EXTENSIONS = ["webp", "jpg", "jpeg", "png"];

/** Returns the public URL (with the /att base path) of an image slot, or null when no file is present. */
export function imageSrc(key: ImageKey): string | null {
  const { file } = images[key];
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(process.cwd(), "public", "images", `${file}.${ext}`))) return `${BASE_PATH}/images/${file}.${ext}`;
  }
  return null;
}

interface SiteImageProps {
  slot: ImageKey;
  className?: string;
  sizes: string;
  /** Fill the parent (parent must be position: relative). */
  fill?: boolean;
  /** Only for the image that is the page's LCP element. */
  preload?: boolean;
}

/** next/image for a named slot; renders nothing until the image file has been added. */
export function SiteImage({ slot, className, sizes, fill = false, preload = false }: SiteImageProps) {
  const src = imageSrc(slot);
  if (!src) return null;
  const { alt, width, height } = images[slot];
  return fill ? (
    <Image src={src} alt={alt} fill sizes={sizes} className={className} preload={preload} />
  ) : (
    <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className={className} preload={preload} />
  );
}
