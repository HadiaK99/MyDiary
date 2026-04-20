import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@frontend/context/AuthContext";

export const metadata: Metadata = {
  title: "My Diary | Kids' Moral & Spiritual Journal",
  description: "A digital diary for kids to track their day and meet their moral and spiritual goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
