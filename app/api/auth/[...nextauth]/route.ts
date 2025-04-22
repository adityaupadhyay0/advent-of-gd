// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "../../../lib/supabaseClient";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Destructure and rename error to fetchError to avoid ESLint unused variable warning
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching user:", fetchError);
        return false;
      }

      // If no user is found, insert a new record
      if (!data) {
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            name: user.name,
            email: user.email,
            image: user.image,
            // Add additional fields if needed
          });

        if (insertError) {
          console.error("Error inserting user:", insertError);
          return false;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

// Export GET and POST as named exports
export { handler as GET, handler as POST };