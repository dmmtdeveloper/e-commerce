"use client";
import Navbar from "@/components/shared/navbar-component/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col relative min-h-screen bg-slate-100">
      <Navbar />
      <div className="flex-grow pt-10 pb-10">{children}</div>
      <Footer />
    </main>
  );
}
