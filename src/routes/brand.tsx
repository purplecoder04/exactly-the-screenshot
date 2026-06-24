import { createFileRoute } from "@tanstack/react-router";
import { AreaPage } from "@/components/shared/AreaPage";

export const Route = createFileRoute("/brand")({
  head: () => ({ meta: [{ title: "Brand — Best Collective" }, { name: "description", content: "Brand projects, voice, and systems." }] }),
  component: () => <AreaPage area="Brand" blurb="Voice, identity, and brand systems." />,
});
