import { Sparkles, Heart } from "lucide-react";

export function QuoteStripFooter() {
  return (
    <div className="mt-8 flex items-center justify-center gap-6 rounded-lg bg-gradient-to-r from-lavender/40 via-blush/30 to-lavender/40 px-6 py-5 text-center font-display text-xl text-ink">
      <Sparkles className="h-5 w-5 text-gold" />
      <p>
        Focus is a <em className="italic text-plum-soft">choice</em>. Progress is the{" "}
        <em className="italic text-plum-soft">result</em>. Impact is the{" "}
        <em className="italic text-plum-soft">mission</em>.
      </p>
      <Sparkles className="h-5 w-5 text-gold" />
      <Heart className="absolute -mb-12 h-4 w-4 fill-plum-soft text-plum-soft opacity-60" />
    </div>
  );
}
