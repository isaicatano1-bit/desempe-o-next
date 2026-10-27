import Link from 'next/link';

import { Footer } from '@/components/explorar/Footer';
import { Header } from '@/components/explorar/Header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#222D28]">
      <Header variant="visitor" />
      {children}
      <Footer />
    </div>
  );
}
