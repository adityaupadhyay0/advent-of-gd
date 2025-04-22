// app/layout.tsx
import Providers from "@/components/Providers";
import AuthButton from "@/components/AuthButton"; // Import the auth button
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextAuth App",
  description: "Google Authentication in Next.js App Router",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="p-4 bg-gray-100">
            <AuthButton /> {/* Auth button in header so it's visible on every page */}
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
