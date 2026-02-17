import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  generateMockPriceData,
  calculateRSI,
  calculateEMA,
  calculateMarketSniperSignal,
  getCurrentSignal,
} from '@/lib/indicators';
import { authOptions } from '@/lib/auth';

// GET - Fetch indicator data
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // Generate price data
    const days = session?.user?.subscriptionStatus === 'active' ? 100 : 30;
    const priceData = generateMockPriceData(days);

    // Calculate indicators
    const rsiData = calculateRSI(priceData, 14);
    const ema9 = calculateEMA(priceData, 9);
    const ema21 = calculateEMA(priceData, 21);
    const ema50 = calculateEMA(priceData, 50);

    // Calculate Market Sniper signals
    const signals = calculateMarketSniperSignal(priceData, rsiData, ema9, ema21);
    const currentSignal = getCurrentSignal(signals);

    // If not subscribed, limit the data
    if (!session || session.user?.subscriptionStatus !== 'active') {
      return NextResponse.json({
        priceData: priceData.slice(-10),
        rsiData: rsiData.slice(-10),
        ema9: ema9.slice(-10),
        ema21: ema21.slice(-10),
        ema50: ema50.slice(-10),
        signals: signals.slice(-3),
        currentSignal: null,
        isLimited: true,
        message: 'Subscribe to access full indicator data',
      });
    }

    return NextResponse.json({
      priceData,
      rsiData,
      ema9,
      ema21,
      ema50,
      signals,
      currentSignal,
      isLimited: false,
    });
  } catch (error) {
    console.error('Error generating indicator data:', error);
    return NextResponse.json(
      { error: 'Failed to generate indicator data' },
      { status: 500 }
    );
  }
}
