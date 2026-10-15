"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type AuthFormState = { error?: string } | undefined;

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  try {
    // On success signIn throws a redirect, which must propagate.
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "Incorrect email or password."
            : "Something went wrong while signing you in. Please try again.",
      };
    }
    throw error;
  }

  return undefined;
}
