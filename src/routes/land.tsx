import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/shared/AreaPage";

export const Route = createFileRoute("/land")({
  head: () => ({ meta: [{ title: "Land — Best Collective" }, { name: "description", content: "Land branch projects." }] }),
  component: () => <AreaPage area="Land" blurb="Foundations, business, and stability work." />,
});
