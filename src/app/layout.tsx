import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "./context/AppProvider";
import { Header } from "./components/Header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SprintLot - Agile Ticket Sizing App",
  description:
    "A planning poker game for agile teams to estimate ticket sizes collaboratively. Collaborate with your team to size your project tickets in real time using SprintLot.",
  authors: [{ name: "Afsal K", url: "https://github.com/makafsal/sprint-lot" }],
  keywords:
    "agile, planning poker, sprint, ticket sizing, estimation, confidence score, scoring, t-shirt sizing, tshirt sizing, shirt sizing, agile sizing, fibonacci sizing, measuring tickets, free, open source, lightweight, online, user friendly",
  openGraph: {
    type: "website",
    description: "Collaborative ticket sizing app for agile teams.",
    title: "SprintLot – Agile Sizing Game",
    url: "https://github.com/makafsal/sprint-lot"
  },
  alternates: {
    canonical: "https://sprint-lot.vercel.app/"
  },
  verification: {
    google: "urgH_uFDodlf1IYGOZROMaOY2_w-_1qseiH9o3kTdDc"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <html lang="en">
        <body>
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
          </Suspense>
          <main>{children}</main>
        </body>
      </html>
    </AppProvider>
  );
}
