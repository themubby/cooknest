
import React from 'react';
import { signIn } from "@/auth";
import { registerManualUser } from "./actions";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      {/* Branding Header */}
      <div className="sm:mx-auto w-full max-w-md">
        <a href="/" className="flex justify-center focus:outline-none">
          <img src="/image/logo.png" alt="CookNest Logo" className="h-30 w-auto object-contain" />
        </a>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          Join CookNest today to organize your kitchen space.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-4xl sm:px-10 border border-gray-100">

          {/* REGISTRATION FORM ROUTING VIA SECURE SERVER ACTION */}
          <form action={registerManualUser} className="space-y-5">

            {/* Full Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="John Doe"
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 text-sm text-gray-900 bg-gray-50/50 transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="john@example.com"
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 text-sm text-gray-900 bg-gray-50/50 transition-all"
                />
              </div>
            </div>

            {/*email input*/}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="+234 810 022 4191"
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 text-sm text-gray-900 bg-gray-50/50 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 text-sm text-gray-900 bg-gray-50/50 transition-all"
                />
              </div>
            </div>

            {/* Terms Disclaimer */}
            <div className="text-xs text-gray-400 font-medium px-1">
              By signing up, you agree to our <a href="#" className="text-orange-500 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>.
            </div>

            {/* Submit Manual Account creation */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer active:scale-[0.99]"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Separation Divider Frame */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-bold tracking-wide">Or sign up with</span>
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
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-200 rounded-full shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer active:scale-[0.99]"
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