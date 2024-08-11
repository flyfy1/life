import "./globals.css";
import type { Metadata } from "next";
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
    <html lang="en" className="dark">
      <body className="">
        <Header/>
        <main className="">
          {children}
        </main>
      </body>
    </html>
  );
}
