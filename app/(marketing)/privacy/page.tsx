import LegalPage from "@/components/marketing/legal-page";

export const metadata = { title: "Privacy Policy | CookNest" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      intro="CookNest is a recipe-sharing app. This policy explains what information we collect, why we collect it and the choices you have."
      sections={[
        {
          heading: "Information we collect",
          body: [
            "Account details: your name and email address when you sign up, or when you sign in with Google. If you register with a password, only a securely hashed version is stored; we never store or see your plain password.",
            "Profile details: the display name and profile photo you choose to set.",
            "Content you create: recipes, categories, and the recipes you mark as favorites.",
            "Newsletter: your email address, if you subscribe to our newsletter.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "To create and secure your account, show your recipes and favorites, and personalise your dashboard.",
            "To send newsletter emails if you subscribed. You can unsubscribe at any time.",
            "To keep the service working, prevent abuse and fix problems.",
          ],
        },
        {
          heading: "Public and private recipes",
          body: [
            "Recipes you publish are visible to other visitors together with your display name. Recipes you keep private are only visible to you.",
          ],
        },
        {
          heading: "Third-party services",
          body: [
            "We use Google Sign-In for authentication, Google Firebase (Firestore) to store data, and Vercel to host the app. These providers process data on our behalf under their own privacy terms.",
            "We do not sell your personal information.",
          ],
        },
        {
          heading: "Data retention and your rights",
          body: [
            "We keep your information for as long as your account is active. You can edit your name and photo on your profile page, and you can ask us to delete your account and associated data at any time by contacting us.",
          ],
        },
        {
          heading: "Security",
          body: [
            "We use industry-standard measures, including password hashing and encrypted connections, but no online service can be guaranteed to be completely secure.",
          ],
        },
        {
          heading: "Changes and contact",
          body: [
            "We may update this policy from time to time and will change the date above when we do. Questions? Visit our Help & Support page.",
          ],
        },
      ]}
    />
  );
}
