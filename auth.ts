// auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials" // <-- 1. IMPORT THIS
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/config/firebase"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Existing Google Configuration
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    // 2. ADD THE CREDENTIALS ENGINE HERE
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        try {
          // Look up user in Firestore
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) return null;

          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          // Verify password matching
          if (userData.password !== password) return null;

          // Return object carrying the phone data over to NextAuth
          return {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || null, 
            image: userData.image || null,
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // 3. UPDATE THE JWT CALLBACK TO CAPTURE USER DATA
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone || null; // Safely pass phone number to the token
      }
      return token;
    },
    // 4. UPDATE THE SESSION CALLBACK TO INJECT INTO THE FRONTEND OBJECT
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).phone = token.phone as string | null; // Inject phone into session object
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
})