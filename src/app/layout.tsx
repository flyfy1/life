import type { Metadata } from "next";
import "./globals.css";
import Header from "@/elements/header";

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
      <body className="">
        <Header/>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          {children}
        </main>
      </body>
    </html>
  );
}
