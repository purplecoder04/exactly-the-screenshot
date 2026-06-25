import bookJournal from "@/assets/planner/elements/book-journal.png";
import butterflyBlush from "@/assets/planner/elements/butterfly-blush.png";
import butterflyLavender from "@/assets/planner/elements/butterfly-lavender.png";
import butterflyOrchid from "@/assets/planner/elements/butterfly-orchid.png";
import butterflyPurple from "@/assets/planner/elements/butterfly-purple.png";
import dividerGold from "@/assets/planner/elements/divider-gold.png";
import floralBouquet from "@/assets/planner/elements/floral-bouquet.png";
import goldSparkles from "@/assets/planner/elements/gold-sparkles.png";
import heartVine from "@/assets/planner/elements/heart-vine.png";
import hydrangea from "@/assets/planner/elements/hydrangea.png";
import jarGarden from "@/assets/planner/elements/jar-garden.png";
import lavenderSprig from "@/assets/planner/elements/lavender-sprig.png";
import leafBlush from "@/assets/planner/elements/leaf-blush.png";
import leafSage from "@/assets/planner/elements/leaf-sage.png";
import washBlue from "@/assets/planner/elements/wash-blue.png";
import washBlush from "@/assets/planner/elements/wash-blush.png";
import washLavender from "@/assets/planner/elements/wash-lavender.png";
import washSage from "@/assets/planner/elements/wash-sage.png";

export const plannerAssets = {
  bookJournal,
  butterflyBlush,
  butterflyLavender,
  butterflyOrchid,
  butterflyPurple,
  dividerGold,
  floralBouquet,
  goldSparkles,
  heartVine,
  hydrangea,
  jarGarden,
  lavenderSprig,
  leafBlush,
  leafSage,
  washBlue,
  washBlush,
  washLavender,
  washSage,
} as const;

export type PlannerAssetName = keyof typeof plannerAssets;
