import LegalPage from "@/components/marketing/legal-page";

export const metadata = { title: "Cookie Policy | CookNest" };

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="October 2026"
      intro="Cookies are small files stored in your browser. CookNest uses only the ones needed to make the app work."
      sections={[
        {
          heading: "Essential cookies",
          body: [
            "We use secure session cookies (set by NextAuth) to keep you signed in. Without them, sign-in would not work.",
          ],
        },
        {
          heading: "Preference storage",
          body: [
            "Your light or dark theme choice is saved in your browser's local storage so the site remembers it on your next visit.",
          ],
        },
        {
          heading: "Analytics and advertising",
          body: [
            "CookNest does not use advertising cookies or third-party tracking cookies.",
          ],
        },
        {
          heading: "Managing cookies",
          body: [
            "You can block or delete cookies in your browser settings. If you block essential cookies you will not be able to stay signed in.",
          ],
        },
      ]}
    />
  );
}
