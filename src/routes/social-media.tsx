import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/shared/AreaPage";

export const Route = createFileRoute("/social-media")({
  head: () => ({ meta: [{ title: "Social Media — Best Collective" }, { name: "description", content: "Social Media content workstream." }] }),
  component: () => <AreaPage area="Social Media" blurb="Reels, hooks, posts, and content lanes." />,
});
