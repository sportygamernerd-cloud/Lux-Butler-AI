import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuxButler AI",
  description: "Your Personal Palace Concierge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
