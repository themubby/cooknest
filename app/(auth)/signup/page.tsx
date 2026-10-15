
import React from 'react';
import { signIn } from "@/auth";
import SignupForm from "./signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-950">

      {/* Branding Header */}
      <div className="sm:mx-auto w-full max-w-md">
        <a href="/" className="flex justify-center focus:outline-none">
          <img src="/image/logo.png" alt="CookNest Logo" className="h-30 w-auto object-contain dark:rounded-2xl dark:bg-gray-100" />
        </a>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium dark:text-gray-400">
          Join CookNest today to organize your kitchen space.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-4xl sm:px-10 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">

          {/* Registration form (client component shows validation errors) */}
          <SignupForm />

          {/* Separation Divider Frame */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-bold tracking-wide dark:bg-gray-900">Or sign up with</span>
            </div>
          </div>

          {/* OAUTH GOOGLE SIGN-UP */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-200 rounded-full shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer active:scale-[0.99] dark:border-gray-800 dark:text-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.39 3.66 1.41 7.55l3.78 2.93C6.12 7.55 8.84 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58l3.76 2.91c2.2-2.03 3.49-5.02 3.49-8.65z" />
                <path fill="#FBBC05" d="M5.19 14.62c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.41 7.11C.51 8.92 0 10.92 0 13s.51 4.08 1.41 5.89l3.78-2.92z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.05.7-2.4 1.13-4.2 1.13-3.16 0-5.88-2.51-6.81-5.44L1.41 15.8C3.39 19.69 7.35 22 12 22z" />
              </svg>
              Sign up with Google
            </button>
          </form>

          {/* Footer Backlink to Login */}
          <div className="mt-6 text-center text-xs font-bold text-gray-400 tracking-wide">
            <span>Already have an account? </span>
            <a href="/login" className="text-orange-500 hover:underline">Log in here</a>
          </div>

        </div>
      </div>
    </div>
  );
}