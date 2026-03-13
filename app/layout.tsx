import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tattoo Shop Onboarding Portal | Anchor Systems",
  description:
    "Premium onboarding portal for tattoo shops joining Anchor Systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-hero-fade text-white antialiased">{children}</body>
    </html>
  );
}
