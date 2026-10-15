"use client";

import React, { useActionState } from "react";
import { loginAction } from "./actions";

const inputClass =
  "appearance-none block w-full px-4 py-3 border border-border rounded-full shadow-sm placeholder-muted/50 focus:outline-none focus:border-primary focus:bg-surface text-sm text-text bg-background/50 transition-all";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-text">
          Email Address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="chef@cooknest.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-text">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-primary hover:bg-opacity-90 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Sign In with Credentials"}
        </button>
      </div>
    </form>
  );
}
