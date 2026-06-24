import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/shared/AreaPage";

export const Route = createFileRoute("/meet-at-the-heal")({
  head: () => ({ meta: [{ title: "Meet at the Heal — Best Collective" }, { name: "description", content: "Couples and reconciliation projects." }] }),
  component: () => <AreaPage area="Meet at the Heal" blurb="Couples, reconciliation, and shared healing." />,
});
