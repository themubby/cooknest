import React from "react";
import { auth } from "@/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import AvatarUpload from "./avatar-upload";

const FALLBACK_AVATAR = "/avatar-placeholder.svg";
// A 256px JPEG is roughly 20-40 KB; this cap keeps documents far below Firestore's 1 MB limit.
const MAX_AVATAR_LENGTH = 300_000;

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const session = await auth();
  const emailKey = session?.user?.email;
  const { saved, error } = await searchParams;

  const googleAvatar = session?.user?.image || FALLBACK_AVATAR;
  const fallbackName = session?.user?.name || "CookNest Chef";
  const chefEmail = emailKey || "No email connected";

  let currentAvatar = googleAvatar;
  let currentName = fallbackName;

  // Load saved profile data (users/<email>), creating a baseline record for first-time Google users.
  // merge:true means a password hash on the same document is never overwritten.
  if (emailKey) {
    try {
      const userDocRef = doc(db, "users", emailKey);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        if (userData.photoURL) currentAvatar = userData.photoURL;
        if (userData.displayName) currentName = userData.displayName;
      } else {
        await setDoc(
          userDocRef,
          {
            email: chefEmail,
            displayName: fallbackName,
            photoURL: googleAvatar,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.error("Firestore sync error:", e);
    }
  }

  async function updateProfile(formData: FormData) {
    "use server";
    const sessionNow = await auth();
    const email = sessionNow?.user?.email;
    if (!email) redirect("/login");

    const updatedName = formData.get("display-name")?.toString().trim();
    const avatarData = formData.get("avatar-data")?.toString() ?? "";

    if (!updatedName) redirect("/dashboard/profile?error=name");

    const changes: Record<string, string> = {
      displayName: updatedName,
      updatedAt: new Date().toISOString(),
    };

    if (avatarData) {
      const looksLikeImage = /^data:image\/(jpeg|png|webp);base64,/.test(avatarData);
      if (!looksLikeImage || avatarData.length > MAX_AVATAR_LENGTH) {
        redirect("/dashboard/profile?error=photo");
      }
      changes.photoURL = avatarData;
    }

    try {
      await setDoc(doc(db, "users", email), changes, { merge: true });
    } catch (e) {
      console.error("Database write error:", e);
      redirect("/dashboard/profile?error=save");
    }

    // Names and avatars appear in the navbar and sidebar of every page
    revalidatePath("/", "layout");
    redirect("/dashboard/profile?saved=1");
  }

  const errorMessages: Record<string, string> = {
    name: "Please enter a display name.",
    photo: "That photo could not be used. Try a different image.",
    save: "Your changes could not be saved. Please try again.",
  };

  return (
    <div className="space-y-6 max-w-4xl transition-colors duration-200">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Your authenticated digital cookbook identity.</p>
      </div>

      {saved && (
        <div role="status" className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-bold text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          Profile updated.
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {errorMessages[error] ?? "Something went wrong."}
        </div>
      )}

      <form action={updateProfile} className="space-y-6">
        {/* CARD 1: IDENTITY DISPLAY & AVATAR EDIT */}
        <div className="bg-white dark:bg-gray-900 rounded-4xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center gap-6 transition-colors">
          <AvatarUpload currentAvatar={currentAvatar} name={currentName} />

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
              🔑 Verified Cloud Cookbook Profile
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white pt-1">{currentName}</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-semibold">{chefEmail}</p>
          </div>
        </div>

        {/* CARD 2: ACCOUNT METADATA */}
        <div className="bg-white dark:bg-gray-900 rounded-4xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-6">Profile Settings</h3>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Account Email
              </label>
              <input
                type="text"
                disabled
                value={chefEmail}
                className="w-full px-5 py-3.5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 text-sm font-semibold text-gray-400 dark:text-gray-600 cursor-not-allowed outline-none"
              />
            </div>

            <div>
              <label htmlFor="display-name" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input
                id="display-name"
                name="display-name"
                type="text"
                required
                defaultValue={currentName}
                placeholder="e.g. Chef John"
                className="w-full px-5 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-all shadow-sm"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-orange-500 text-white font-bold text-sm rounded-full hover:bg-orange-600 shadow-sm shadow-orange-500/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                Update Preferences
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
