import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export type ChefProfile = { name: string; image?: string };

/**
 * The login session only knows the name/photo from sign-in time. The profile
 * page saves edits to Firestore (users/<email>), so layouts read them from
 * there to always show the latest name and avatar.
 */
export async function getChefProfile(
  email: string | null | undefined,
  fallback: { name?: string | null; image?: string | null }
): Promise<ChefProfile> {
  let name = fallback.name || "CookNest Chef";
  let image = fallback.image || undefined;

  if (email) {
    try {
      const snapshot = await getDoc(doc(db, "users", email));
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.displayName) name = data.displayName;
        if (data.photoURL) image = data.photoURL;
      }
    } catch (error) {
      console.error("Could not load chef profile:", error);
    }
  }

  return { name, image };
}
