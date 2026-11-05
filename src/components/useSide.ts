"use client";

import { usePathname } from "next/navigation";
import { SIDES, sideForPath } from "@/lib/site";

/** Which version of the site the current page belongs to, plus that side's label, home and email. */
export function useSide() {
  const pathname = usePathname() || "/";
  const side = sideForPath(pathname);
  return { side, ...SIDES[side] };
}
