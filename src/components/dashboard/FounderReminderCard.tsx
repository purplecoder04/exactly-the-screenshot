import { useState } from "react";
import { Heart, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function FounderReminderCard({
  reminder,
  onChange,
}: {
  reminder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(reminder);

  return (
    <div className="relative flex h-full flex-col items-center justify-center rounded-lg bg-gradient-to-b from-plum-deep to-[oklch(0.25_0.07_325)] p-6 text-center text-warm-white shadow-md">
      <div className="absolute right-2 top-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-warm-white/70 hover:bg-white/10 hover:text-warm-white"
          onClick={() => {
            setDraft(reminder);
            setOpen(true);
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-white/80">
        Founder Reminder
      </div>
      <Heart className="my-3 h-5 w-5 text-gold" strokeWidth={1.5} />
      <div className="font-display text-xl italic leading-snug">
        {reminder.split("\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <Heart className="mt-3 h-5 w-5 text-gold" strokeWidth={1.5} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Edit Founder Reminder</DialogTitle>
          </DialogHeader>
          <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
