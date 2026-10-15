"use server";

import { AuthError } from "next-auth";
import { doc, getDoc, getDocs, collection, query, where, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { signIn } from "@/auth";
import { hashPassword } from "@/lib/password";

export type SignupState = { error?: string } | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerManualUser(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const phone = formData.get("phone")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!name || !email || !phone || !password) {
    return { error: "Please fill in every field." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Your password must be at least 8 characters long." };
  }

  try {
    // 1. Reject duplicates (covers old auto-id documents and email-keyed ones)
    const existing = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );
    const keyedDoc = await getDoc(doc(db, "users", email));
    const alreadyHasAccount =
      existing.docs.some((d) => d.data().passwordHash || d.data().password) ||
      (keyedDoc.exists() && !!(keyedDoc.data().passwordHash || keyedDoc.data().password));

    if (alreadyHasAccount) {
      return { error: "This email address is already registered. Try logging in." };
    }

    // 2. One document per user, keyed by email, password stored as a bcrypt hash.
    //    merge:true keeps any profile fields if a Google user later adds a password.
    await setDoc(
      doc(db, "users", email),
      {
        name,
        email,
        phone,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
        provider: "credentials",
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Registration failure:", error);
    return { error: "We couldn't create your account right now. Please try again." };
  }

  // 3. Sign the new user in. Success throws a redirect that must propagate.
  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Your account was created, but automatic sign-in failed. Please log in.",
      };
    }
    throw error;
  }

  return undefined;
}
