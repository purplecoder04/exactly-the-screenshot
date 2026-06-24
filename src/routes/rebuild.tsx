import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/shared/AreaPage";

export const Route = createFileRoute("/rebuild")({
  head: () => ({ meta: [{ title: "Rebuild — Best Collective" }, { name: "description", content: "Rebuild branch projects." }] }),
  component: () => <AreaPage area="Rebuild" blurb="Repair, recovery, and rebuild work." />,
});
