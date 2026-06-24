import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/shared/AreaPage";

export const Route = createFileRoute("/kit-factory-app")({
  head: () => ({ meta: [{ title: "Kit Factory App — Best Collective" }, { name: "description", content: "Kit Factory App workstream." }] }),
  component: () => <AreaPage area="Kit Factory App" blurb="Build, import, export workflows." />,
});
