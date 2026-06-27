
import React from 'react';
import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Branding and Subtext Header */}
      <div className="sm:mx-auto w-full max-w-md">
        <a href="/" className="flex justify-center focus:outline-none">
          <img src="/image/logo.png" alt="CookNest Logo" className="h-35 w-auto object-contain" />
        </a>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-text">
          Welcome back to the Nest
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          Log in to access your recipes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-border/40">
          
          {/* FORM 1: NATIVE EMAIL & PASSWORD LOGINS VIA SERVER ACTION */}
          <form
            action={async (formData: FormData) => {
              "use server";
              
              const email = formData.get("email");
              const password = formData.get("password");

              try {
                // Submit inputs right to your Auth.js credential handler framework
                await signIn("credentials", {
                  email,
                  password,
                  redirectTo: "/dashboard",
                });
              } catch (error) {
                // If credentials match fails, Auth.js handles routing errors back cleanly
                console.error("Credentials Authentication Failure:", error);
                throw error;
              }
            }}
            className="space-y-6"
          >
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
                  className="appearance-none block w-full px-4 py-3 border border-border rounded-full shadow-sm placeholder-muted/50 focus:outline-none focus:border-primary focus:bg-white text-sm text-text bg-background/50 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-text">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="appearance-none block w-full px-4 py-3 border border-border rounded-full shadow-sm placeholder-muted/50 focus:outline-none focus:border-primary focus:bg-white text-sm text-text bg-background/50 transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-primary hover:bg-opacity-90 transition-all cursor-pointer active:scale-[0.99]"
              >
                Sign In with Credentials
              </button>
            </div>
          </form>

          {/* Separation Divider Frame */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted font-medium">Or continue with</span>
            </div>
          </div>

          {/* FORM 2: OAUTH GOOGLE SIGN-IN VIA SERVER ACTION */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-border rounded-full shadow-sm text-sm font-bold text-text bg-white hover:bg-background transition-all cursor-pointer active:scale-[0.99]"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.39 3.66 1.41 7.55l3.78 2.93C6.12 7.55 8.84 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58l3.76 2.91c2.2-2.03 3.49-5.02 3.49-8.65z"/>
                <path fill="#FBBC05" d="M5.19 14.62c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.41 7.11C.51 8.92 0 10.92 0 13s.51 4.08 1.41 5.89l3.78-2.92z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.05.7-2.4 1.13-4.2 1.13-3.16 0-5.88-2.51-6.81-5.44L1.41 15.8C3.39 19.69 7.35 22 12 22z"/>
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Footer Registration Hook */}
          <div className="mt-6 text-center text-xs font-medium text-muted">
            <span>Don't have an account? </span>
            <a href="/signup" className="text-primary hover:underline font-bold">Create one here</a>
          </div>

        </div>
      </div>
    </div>
  );
}