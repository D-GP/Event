import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';

export const metadata: Metadata = {
  title: 'Eventrix — Next-Gen Event Management',
  description: 'Seamlessly organize, manage, and attend events with AI-powered descriptions, instant QR check-ins, and automated certificates.',
  keywords: ['events', 'event management', 'QR check-in', 'certificates', 'AI'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
