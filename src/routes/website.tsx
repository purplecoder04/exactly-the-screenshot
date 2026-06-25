import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/shared/AreaPage";

export const Route = createFileRoute("/website")({
  head: () => ({
    meta: [
      { title: "Website - Best Collective" },
      { name: "description", content: "Website workstream." },
    ],
  }),
  component: () => <AreaPage area="Website" blurb="Pages, shop, and on-site experience." />,
});
