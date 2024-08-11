import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life - Help you Grow",
  description: "Diary, OKR, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}
