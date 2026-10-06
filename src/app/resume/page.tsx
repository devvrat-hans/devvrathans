import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ResumeViewer from "./ResumeViewer";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "Resume & Curriculum Vitae | Devvrat Hans",
  description:
    "View and download Devvrat Hans's 1-page Software Engineering / AI Resume and comprehensive 5-page Academic Master CV.",
  path: "/resume/",
});

export default function ResumePage() {
  return <ResumeViewer />;
}
