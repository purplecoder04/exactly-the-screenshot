import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/shared/AreaPage";

export const Route = createFileRoute("/social-media-app")({
  head: () => ({ meta: [{ title: "Social Media App — Best Collective" }, { name: "description", content: "Social Media App workstream." }] }),
  component: () => <AreaPage area="Social Media App" blurb="Scheduling, automation, and creator tooling." />,
});
