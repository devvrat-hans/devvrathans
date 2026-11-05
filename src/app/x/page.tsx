import { pageMetadata } from "@/lib/seo";
import XRatesClient from "./XRatesClient";

export const dynamic = "force-static";

export const metadata = pageMetadata({
  title: "Promotion on X | Devvrat Hans",
  socialTitle: "Promotion on X: rates for sponsored posts",
  description:
    "Flat rates for sponsored posts, quotes, reposts, comments and pins on X from Devvrat Hans (@DevvratHans), who builds Aback in public.",
  path: "/x/",
  image: "x",
});

export default function XPage() {
  return <XRatesClient />;
}
