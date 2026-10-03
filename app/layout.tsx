import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Žiedai – Gėlės kiekvienai progai",
  description: "Gėlių puokščių parduotuvė"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  );
}