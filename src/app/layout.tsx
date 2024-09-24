import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";


const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Socius Bootcamp Ecommerce",
  description: "Proyecto grupo 6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressContentEditableWarning className={sora.className}>
        {children}
        {/* <SessionAuthprovider>{children}</SessionAuthprovider> */}
      </body>
    </html>
  );
}
