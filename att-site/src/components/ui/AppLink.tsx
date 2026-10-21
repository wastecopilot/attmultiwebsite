import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * next/link with viewport prefetching turned off. Next.js still prefetches on hover/touch, so
 * navigation stays fast, but pages no longer download other routes' payloads while they load
 * (saves bandwidth and main-thread time on mobile).
 */
export default function AppLink({ prefetch = false, ...props }: ComponentProps<typeof Link>) {
  return <Link prefetch={prefetch} {...props} />;
}
