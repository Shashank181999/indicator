import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Market Sniper - Professional Trading Indicators',
  description: 'Advanced trading indicators powered by proven algorithms. Get real-time RSI, EMA, and custom signals to maximize your trading success.',
  keywords: 'trading indicators, market sniper, RSI, EMA, trading signals, crypto, bitcoin, nifty',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#030712] text-gray-100 min-h-screen antialiased`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
