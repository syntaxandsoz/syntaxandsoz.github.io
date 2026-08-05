import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://syntaxandsoz.github.io"),
  title: "Syntax & Soz | Developer Terminal",
  description: "Advanced privacy, security, and developer utilities.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={firaCode.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="doc-layout">
          <nav className="sidebar">
            {/* Keep existing navigation links here, but remove their Tailwind classes */}
          </nav>
          <main className="content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
