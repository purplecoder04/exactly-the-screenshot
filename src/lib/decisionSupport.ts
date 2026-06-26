import type { DecisionOutcome } from "@/lib/types";

export type DecisionInputs = {
  urgency: number;
  impact: number;
  effort: number;
  clarity: number;
  reversible: boolean;
};

export function scoreDecision({ urgency, impact, effort, clarity, reversible }: DecisionInputs): {
  score: number;
  outcome: DecisionOutcome;
  reason: string;
} {
  const effortPenalty = effort * 6;
  const reversibleBoost = reversible ? 5 : 0;
  const score = Math.max(
    0,
    Math.min(100, urgency * 8 + impact * 10 + clarity * 6 + reversibleBoost - effortPenalty),
  );

  if (clarity <= 1) {
    return {
      score,
      outcome: "Needs Decision",
      reason: "The next step needs more clarity before it becomes active work.",
    };
  }

  if (score >= 76 && urgency >= 4) {
    return {
      score,
      outcome: "Do Now",
      reason: "High urgency, strong impact, and enough clarity to act.",
    };
  }

  if (score >= 58) {
    return {
      score,
      outcome: "Schedule",
      reason: "Worth doing, but it does not have to interrupt today's core plan.",
    };
  }

  if (impact >= 3 && urgency <= 2) {
    return {
      score,
      outcome: "Park",
      reason: "Potential value, but it belongs in the Idea Garden until timing improves.",
    };
  }

  return {
    score,
    outcome: "Not Now",
    reason: "Low current leverage compared with the company work already in motion.",
  };
}
