import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col relative min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
