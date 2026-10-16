"use client";

import React, { useActionState } from "react";
import { subscribeAction } from "./newsletter-actions";

export default function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeAction, undefined);

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
          aria-label="Email address"
          className="bg-background border border-border rounded-full px-5 py-3 text-sm w-full focus:outline-none focus:border-primary focus:bg-surface transition-all text-text"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-white font-semibold text-sm px-6 py-3 rounded-full hover:opacity-90 shadow-sm transition-all whitespace-nowrap cursor-pointer disabled:opacity-60"
        >
          {isPending ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {state?.message && (
        <p
          role="status"
          className={`text-xs font-semibold ${state.ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
