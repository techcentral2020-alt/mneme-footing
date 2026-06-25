import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mneme Footing",
  description: "Portfolio foundation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-body text-text-primary">
        {children}
      </body>
    </html>
  );
}
