import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

type Tile = { label: string; value: number; tint: string };

export function AtAGlanceCard({
  tiles,
}: {
  tiles: Tile[];
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum-deep">
          <Eye className="h-4 w-4 text-plum-soft" />
          At a Glance
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {tiles.map((t) => (
          <div
            key={t.label}
            className={`rounded-md ${t.tint} px-3 py-3 text-center`}
          >
            <div className="font-display text-2xl font-medium text-ink">{t.value}</div>
            <div className="text-[11px] text-muted-foreground">{t.label}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
