"use server";

import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { signIn } from "@/auth";

export async function registerManualUser(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const phone = formData.get("phone")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!name || !email || !phone || !password) {
    throw new Error("All fields are strictly required.");
  }

  try {
    // 1. CHECK IF USER ALREADY EXISTS IN FIRESTORE
    const usersRef = collection(db, "users");
    const existingUserQuery = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(existingUserQuery);

    if (!querySnapshot.empty) {
      throw new Error("This email address is already registered.");
    }

    // 2. LIVE WRITE TO FIRESTORE
    // Note: For a true live production system, hash this password (e.g., using bcryptjs) 
    // before saving it into Firestore to protect user credentials.
    await addDoc(usersRef, {
      name,
      email,
      phone,
      password: password, // Store hashed version here in production
      createdAt: new Date().toISOString(),
      provider: "credentials"
    });

    console.log(`Successfully recorded manual chef account in cloud ledger: ${email}`);

    // 3. HANDSHAKE WITH NEXTAUTH CREDENTIALS PROVIDER FOR AUTOMATIC LOGIN
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

  } catch (error: any) {
    console.error("Manual Registration Failure Root: ", error.message);
    throw error;
  }
}