import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Consent from '@/components/Consent';
import { MotionProvider } from '@/components/motion';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-accent focus:text-paper focus:p-2">Skip to content</a>
      <Header />
      <main id="main" className="mx-auto max-w-6xl px-4">{children}</main>
      <Footer />
      <Consent />
    </MotionProvider>
  );
}
