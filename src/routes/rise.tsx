import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/shared/AreaPage";

export const Route = createFileRoute("/rise")({
  head: () => ({ meta: [{ title: "Rise — Best Collective" }, { name: "description", content: "Rise branch projects." }] }),
  component: () => <AreaPage area="Rise" blurb="Women's growth, return, and rising work." />,
});
