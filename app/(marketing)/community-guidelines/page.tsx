import LegalPage from "@/components/marketing/legal-page";

export const metadata = { title: "Community Guidelines | CookNest" };

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage
      title="Community Guidelines & Content Policy"
      updated="October 2026"
      intro="CookNest is a place for home cooks to share recipes. These guidelines keep it useful, safe and welcoming for everyone."
      sections={[
        {
          heading: "Share complete recipes",
          body: [
            "Every recipe needs a title, a cooking time, a category, a list of ingredients and step-by-step instructions. Incomplete or placeholder recipes may be removed.",
          ],
        },
        {
          heading: "Post only what is yours to share",
          body: [
            "Share your own recipes, or recipes you have permission to share, and credit the original cook where you can. Do not copy other people's recipes, text or photos without permission.",
          ],
        },
        {
          heading: "Be accurate and safe",
          body: [
            "Do not post recipes that are deliberately unsafe or misleading. Mention major allergens where you know them, and use safe cooking temperatures and handling for meat, eggs and dairy.",
          ],
        },
        {
          heading: "Be respectful",
          body: [
            "No hateful, abusive, sexual or unlawful content, spam or advertising. We may remove content or suspend accounts that break these rules.",
          ],
        },
        {
          heading: "Reporting a problem",
          body: [
            "If you see a recipe that breaks these guidelines, contact us through the Help & Support page and tell us which recipe it is.",
          ],
        },
      ]}
    />
  );
}
