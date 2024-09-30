"use client";
import Navbar from "@/components/shared/navbar-component/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col relative min-h-screen">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </main>
  );
}
