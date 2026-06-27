
import React from 'react';
import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  
  const googleAvatar = session?.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
  const chefName = session?.user?.name || 'CookNest Chef';
  const chefEmail = session?.user?.email || 'No email connected';
  const chefPhone = session?.user?.phone || 'No phone connected'

  // Server Action handler for updating text fields if needed
  async function updateProfile(formData: FormData) {
    "use server";
    const updatedName = formData.get("display-name");
    console.log("Updating local profile alias to:", updatedName);
  }

  return (
    <div className="space-y-6 max-w-4xl transition-colors duration-200">
      
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Your authenticated digital cookbook identity.</p>
      </div>

      {/* CARD 1: GOOGLE IDENTITY BANNER */}
      <div className="bg-white dark:bg-gray-900 rounded-4xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center gap-6 transition-colors">
        
        {/* Google Dynamic Account Avatar Display Frame */}
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-orange-500 ring-4 ring-orange-500/10 bg-gray-50 dark:bg-gray-950 shrink-0">
          <img 
            src={googleAvatar} 
            alt={chefName} 
            referrerPolicy="no-referrer" // Prevents Google from blocking image rendering on localhost
            className="h-full w-full object-cover"
          />
        </div>

        {/* Identity Details */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
            🔑 Verified Google Profile Account
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white pt-1">
            {chefName}
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-semibold">
            {chefEmail}
          </p>
        </div>
      </div>

      {/* CARD 2: ACCOUNT METADATA VIEW */}
      <div className="bg-white dark:bg-gray-900 rounded-4xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
        <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-6">Profile Settings</h3>
        
        <form action={updateProfile} className="space-y-5">
          {/* Email Row (Read Only) */}
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Account Email
            </label>
            <input
              type="text"
              disabled
              value={chefEmail}
              className="w-full px-5 py-3.5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-950 text-sm font-semibold text-gray-400 dark:text-gray-600 cursor-not-allowed outline-none"
            />
          </div>

          {/* Display Name Input (Pre-filled with Google Name) */}
          <div>
            <label htmlFor="display-name" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Display Name
            </label>
            <input
              id="display-name"
              name="display-name"
              type="text"
              required
              defaultValue={chefName}
              placeholder="e.g. Chef John"
              className="w-full px-5 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-all shadow-sm"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-orange-500 text-white font-bold text-sm rounded-full hover:bg-orange-600 shadow-sm shadow-orange-500/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              Update Preferences
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}