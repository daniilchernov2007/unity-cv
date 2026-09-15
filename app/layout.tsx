import type { Metadata } from "next";
import { Montserrat, Marck_Script } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

const marckScript = Marck_Script({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Daniil Chernov — Unity Developer",
  description:
    "Unity developer with about 3 years of commercial experience shipping mobile and WebGL games — from prototype to store release.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${marckScript.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
