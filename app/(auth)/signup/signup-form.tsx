"use client";

import React, { useActionState } from "react";
import { registerManualUser } from "./actions";

const inputClass =
  "appearance-none block w-full px-4 py-3 border border-gray-200 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 text-sm text-gray-900 bg-gray-50/50 transition-all dark:border-gray-800 dark:text-white dark:bg-gray-950/50";
const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-300";

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(registerManualUser, undefined);

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>Full Name</label>
        <div className="mt-1">
          <input id="name" name="name" type="text" autoComplete="name" required placeholder="John Doe" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email Address</label>
        <div className="mt-1">
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="john@example.com" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>Phone Number</label>
        <div className="mt-1">
          <input id="phone" name="phone" type="tel" autoComplete="tel" required placeholder="+234 810 022 4191" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <div className="mt-1">
          <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" className={inputClass} />
        </div>
      </div>

      <div className="text-xs text-gray-400 font-medium px-1">
        By signing up, you agree to our <span className="text-orange-500">Terms of Service</span> and{" "}
        <span className="text-orange-500">Privacy Policy</span>.
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      </div>
    </form>
  );
}
