import type { Metadata } from "next";

import "swagger-ui-dist/swagger-ui.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth Platform Foundation",
  description: "Next.js foundation setup with tokenized UI, API skeletons, and Swagger docs."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
