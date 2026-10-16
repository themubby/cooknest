"use server";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export type NewsletterState = { ok?: boolean; message?: string } | undefined;

export async function subscribeAction(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  try {
    await setDoc(doc(db, "subscribers", email), { email, subscribedAt: new Date().toISOString() }, { merge: true });
    return { ok: true, message: "You're subscribed. Welcome to the kitchen!" };
  } catch (e) {
    console.error("Newsletter subscribe failed:", e);
    return { ok: false, message: "Could not subscribe right now. Please try again later." };
  }
}
