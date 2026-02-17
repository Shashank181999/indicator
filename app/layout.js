import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Market Sniper - Professional Trading Indicators',
  description: 'Advanced trading indicators powered by proven algorithms. Get real-time RSI, EMA, and custom signals to maximize your trading success.',
  keywords: 'trading indicators, market sniper, RSI, EMA, trading signals, stock market',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
