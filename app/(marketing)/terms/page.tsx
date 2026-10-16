import LegalPage from "@/components/marketing/legal-page";

export const metadata = { title: "Terms of Service | CookNest" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 2026"
      intro="By creating an account or using CookNest you agree to these terms. If you do not agree, please do not use the service."
      sections={[
        {
          heading: "Your account",
          body: [
            "You are responsible for the activity on your account and for keeping your password secure. Provide accurate information and do not share your account with others.",
          ],
        },
        {
          heading: "Your content",
          body: [
            "You keep ownership of the recipes and other content you post. By publishing a recipe you give CookNest permission to display it to other users within the service.",
            "Only post content you have the right to share. Do not copy other people's recipes or photos without permission.",
          ],
        },
        {
          heading: "Acceptable use",
          body: [
            "Do not post unlawful, hateful, misleading or harmful content, attempt to break or overload the service, or access other users' private data.",
            "We may remove content or suspend accounts that break these rules.",
          ],
        },
        {
          heading: "Recipes and food safety",
          body: [
            "Recipes are shared by community members for general information. CookNest does not verify them. You are responsible for checking ingredients for allergies and for following safe cooking and food-handling practices.",
          ],
        },
        {
          heading: "Availability and liability",
          body: [
            "The service is provided \"as is\" without warranties. We may change or discontinue features at any time, and to the extent permitted by law we are not liable for losses arising from use of the service.",
          ],
        },
        {
          heading: "Changes",
          body: [
            "We may update these terms. Continuing to use CookNest after a change means you accept the updated terms.",
          ],
        },
      ]}
    />
  );
}
