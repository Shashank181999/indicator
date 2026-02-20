import { NextResponse } from 'next/server';

// Check if a symbol is crypto (24/7 market)
function isCryptoSymbol(symbol) {
  return symbol.includes('-USD') || symbol.includes('BTC') || symbol.includes('ETH') ||
         symbol.includes('SOL') || symbol.includes('XRP') || symbol.includes('DOGE');
}

// Map timeframe to Binance interval
function getBinanceInterval(timeframe) {
  const intervalMap = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '30m': '30m',
    '1h': '1h',
    '4h': '4h',
    '1d': '1d',
    '1w': '1w',
  };
  return intervalMap[timeframe] || '15m';
}

// Map symbol to Binance symbol
function getBinanceSymbol(symbol) {
  const symbolMap = {
    'BTC-USD': 'BTCUSDT',
    'ETH-USD': 'ETHUSDT',
    'SOL-USD': 'SOLUSDT',
    'XRP-USD': 'XRPUSDT',
    'DOGE-USD': 'DOGEUSDT',
  };
  return symbolMap[symbol] || symbol.replace('-USD', 'USDT');
}

// Fetch candlestick data from Binance (try multiple endpoints)
async function fetchBinanceKlines(symbol, interval = '15m', limit = 100) {
  const binanceSymbol = getBinanceSymbol(symbol);

  // Try multiple Binance endpoints
  const endpoints = [
    `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`,
    `https://api1.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`,
    `https://api2.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`,
    `https://api3.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 0 },
      });

      if (!res.ok) continue;

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        // Convert Binance klines to our format
        return data.map(k => ({
          date: new Date(k[0]).toISOString(),
          timestamp: k[0],
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
          volume: parseFloat(k[5]),
        }));
      }
    } catch (error) {
      console.error(`Binance endpoint failed: ${url}`, error.message);
      continue;
    }
  }

  console.error('All Binance endpoints failed for:', binanceSymbol);
  return null;
}

// Fetch current price from Binance (try multiple endpoints)
async function fetchBinancePrice(symbol) {
  const binanceSymbol = getBinanceSymbol(symbol);

  const endpoints = [
    `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
    `https://api1.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
    `https://api2.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
    `https://api3.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 0 },
      });

      if (!res.ok) continue;

      const data = await res.json();

      if (data && data.lastPrice) {
        return {
          price: parseFloat(data.lastPrice),
          prevClose: parseFloat(data.prevClosePrice),
          priceChange: parseFloat(data.priceChange),
          priceChangePercent: parseFloat(data.priceChangePercent),
          high24h: parseFloat(data.highPrice),
          low24h: parseFloat(data.lowPrice),
          volume24h: parseFloat(data.volume),
        };
      }
    } catch (error) {
      console.error(`Binance ticker endpoint failed: ${url}`, error.message);
      continue;
    }
  }

  console.error('All Binance ticker endpoints failed for:', binanceSymbol);
  return null;
}

// Check if Indian market hours (9:15 AM - 3:30 PM IST, Mon-Fri)
function isIndianMarketOpen() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  const day = ist.getUTCDay();
  const hours = ist.getUTCHours();
  const minutes = ist.getUTCMinutes();
  const time = hours * 60 + minutes;

  if (day === 0 || day === 6) return false;
  return time >= 9 * 60 + 15 && time <= 15 * 60 + 30;
}

// Check if US market hours (9:30 AM - 4:00 PM ET, Mon-Fri)
function isUSMarketOpen() {
  const now = new Date();
  const etOffset = -5 * 60 * 60 * 1000;
  const et = new Date(now.getTime() + etOffset);
  const day = et.getUTCDay();
  const hours = et.getUTCHours();
  const minutes = et.getUTCMinutes();
  const time = hours * 60 + minutes;

  if (day === 0 || day === 6) return false;
  return time >= 9 * 60 + 30 && time <= 16 * 60;
}

// Fetch real-time stock data from Yahoo Finance
async function fetchYahooFinance(symbol) {
  try {
    // Use different ranges based on market type
    let interval = '5m';
    let range = '5d'; // Fetch 5 days to always have data

    // For crypto, we can use shorter range since it's 24/7
    if (isCryptoSymbol(symbol)) {
      range = '1d';
      interval = '1m'; // More granular for live crypto
    }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store', // Don't cache - always get fresh data
    });

    if (!res.ok) throw new Error('Yahoo Finance API error');

    const data = await res.json();
    return data.chart.result[0];
  } catch (error) {
    console.error('Yahoo Finance error:', error);
    return null;
  }
}

// Convert Yahoo data to our format
function formatStockData(yahooData, symbol) {
  if (!yahooData) return null;

  const { timestamp, indicators, meta } = yahooData;
  const quote = indicators.quote[0];

  const data = [];
  for (let i = 0; i < timestamp.length; i++) {
    if (quote.close[i] !== null && quote.open[i] !== null) {
      data.push({
        date: new Date(timestamp[i] * 1000).toISOString(),
        timestamp: timestamp[i] * 1000,
        open: quote.open[i],
        high: quote.high[i],
        low: quote.low[i],
        close: quote.close[i],
        volume: quote.volume[i] || 0,
      });
    }
  }

  // Get last trade time
  const lastTradeTime = data.length > 0 ? data[data.length - 1].timestamp : null;
  const lastTradeDate = lastTradeTime ? new Date(lastTradeTime) : null;

  // Determine if market is currently open
  let isMarketOpen = false;
  let marketStatus = 'closed';

  if (isCryptoSymbol(symbol)) {
    isMarketOpen = true;
    marketStatus = 'open';
  } else if (symbol.includes('.NS') || symbol.includes('^NSE') || symbol.includes('^BSE')) {
    isMarketOpen = isIndianMarketOpen();
    marketStatus = isMarketOpen ? 'open' : 'closed';
  } else if (symbol.includes('=F') || symbol.includes('=X')) {
    // Commodities and Forex - mostly 24/5
    const day = new Date().getDay();
    isMarketOpen = day !== 0 && day !== 6;
    marketStatus = isMarketOpen ? 'open' : 'closed';
  } else {
    isMarketOpen = isUSMarketOpen();
    marketStatus = isMarketOpen ? 'open' : 'closed';
  }

  return {
    symbol: meta.symbol,
    currency: meta.currency,
    exchange: meta.exchangeName,
    regularMarketPrice: meta.regularMarketPrice,
    previousClose: meta.previousClose || meta.chartPreviousClose,
    data,
    isMarketOpen,
    marketStatus,
    lastTradeTime: lastTradeDate ? lastTradeDate.toISOString() : null,
  };
}

// Calculate RSI
function calculateRSI(data, period = 14) {
  if (data.length < period + 1) return [];

  const rsiData = [];
  const closes = data.map(d => d.close);

  for (let i = period; i < closes.length; i++) {
    let gains = 0;
    let losses = 0;

    for (let j = i - period + 1; j <= i; j++) {
      const change = closes[j] - closes[j - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    let rsi = avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss));

    rsiData.push({
      date: data[i].date,
      timestamp: data[i].timestamp,
      value: parseFloat(rsi.toFixed(2)),
    });
  }

  return rsiData;
}

// Calculate Stochastic RSI for Market Sniper oscillator
function calculateStochRSI(rsiData, period = 14) {
  if (rsiData.length < period) return [];

  const stochRSI = [];

  for (let i = period - 1; i < rsiData.length; i++) {
    const rsiSlice = rsiData.slice(i - period + 1, i + 1).map(r => r.value);
    const minRSI = Math.min(...rsiSlice);
    const maxRSI = Math.max(...rsiSlice);

    let stoch = maxRSI === minRSI ? 50 : ((rsiData[i].value - minRSI) / (maxRSI - minRSI)) * 100;

    stochRSI.push({
      date: rsiData[i].date,
      timestamp: rsiData[i].timestamp,
      value: parseFloat(stoch.toFixed(2)),
    });
  }

  return stochRSI;
}

// Calculate SMA for smoothing
function calculateSMA(data, period) {
  if (data.length < period) return [];

  const smaData = [];

  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, d) => acc + (d.value || d.close || d), 0);
    const avg = sum / period;

    smaData.push({
      date: data[i].date || data[i].timestamp,
      timestamp: data[i].timestamp,
      value: parseFloat(avg.toFixed(2)),
    });
  }

  return smaData;
}

// Calculate Market Sniper Oscillator (custom momentum indicator)
function calculateSniperOscillator(data, rsiPeriod = 14, smoothK = 3, smoothD = 3) {
  const rsiData = calculateRSI(data, rsiPeriod);
  if (rsiData.length < 14) return { k: [], d: [], histogram: [] };

  const stochRSI = calculateStochRSI(rsiData, 14);
  if (stochRSI.length < smoothK) return { k: [], d: [], histogram: [] };

  // Smooth K line
  const kLine = calculateSMA(stochRSI, smoothK);

  // Smooth D line (signal line)
  const dLine = calculateSMA(kLine, smoothD);

  // Calculate histogram
  const histogram = [];
  for (let i = 0; i < dLine.length; i++) {
    const kIdx = kLine.findIndex(k => k.timestamp === dLine[i].timestamp);
    if (kIdx !== -1) {
      histogram.push({
        date: dLine[i].date,
        timestamp: dLine[i].timestamp,
        value: parseFloat((kLine[kIdx].value - dLine[i].value).toFixed(2)),
        k: kLine[kIdx].value,
        d: dLine[i].value,
      });
    }
  }

  // Pad kLine to match priceData length from the start
  // Smooth transition from neutral (50) to first calculated value
  if (kLine.length > 0 && data.length > kLine.length) {
    const firstK = kLine[0];
    const paddedK = [];

    // Find where kLine starts in the original data
    const kStartIdx = data.findIndex(d => d.date === firstK.date);

    // Create smooth transition from 50 to first value
    for (let i = 0; i < kStartIdx; i++) {
      // Ease-in transition: starts slow, accelerates toward first value
      const progress = i / kStartIdx;
      const eased = progress * progress; // Quadratic ease-in
      const value = 50 + (firstK.value - 50) * eased;

      paddedK.push({
        date: data[i].date,
        timestamp: data[i].timestamp,
        value: parseFloat(value.toFixed(2)),
      });
    }

    // Add original kLine data
    paddedK.push(...kLine);

    return { k: paddedK, d: dLine, histogram };
  }

  return { k: kLine, d: dLine, histogram };
}

// Detect pivot points for Support/Resistance
function detectPivots(data, leftBars = 5, rightBars = 5) {
  const pivots = { highs: [], lows: [] };

  for (let i = leftBars; i < data.length - rightBars; i++) {
    const current = data[i];
    let isHigh = true;
    let isLow = true;

    // Check left bars
    for (let j = i - leftBars; j < i; j++) {
      if (data[j].high >= current.high) isHigh = false;
      if (data[j].low <= current.low) isLow = false;
    }

    // Check right bars
    for (let j = i + 1; j <= i + rightBars; j++) {
      if (data[j].high >= current.high) isHigh = false;
      if (data[j].low <= current.low) isLow = false;
    }

    if (isHigh) {
      pivots.highs.push({
        date: current.date,
        timestamp: current.timestamp,
        price: current.high,
        index: i,
      });
    }

    if (isLow) {
      pivots.lows.push({
        date: current.date,
        timestamp: current.timestamp,
        price: current.low,
        index: i,
      });
    }
  }

  return pivots;
}

// Calculate Support/Resistance levels from pivots
function calculateSRLevels(data, numPivots = 15) {
  const pivots = detectPivots(data, 3, 3);

  // Get most recent pivots
  const recentHighs = pivots.highs.slice(-numPivots);
  const recentLows = pivots.lows.slice(-numPivots);

  // Cluster pivot levels to find significant S/R
  const allLevels = [
    ...recentHighs.map(p => ({ ...p, type: 'resistance' })),
    ...recentLows.map(p => ({ ...p, type: 'support' })),
  ];

  // Sort by price
  allLevels.sort((a, b) => b.price - a.price);

  // Cluster nearby levels (within 0.5% of each other)
  const clusteredLevels = [];
  const tolerance = 0.005; // 0.5%

  for (const level of allLevels) {
    const existingCluster = clusteredLevels.find(
      c => Math.abs(c.price - level.price) / c.price < tolerance
    );

    if (existingCluster) {
      existingCluster.strength++;
      existingCluster.touches.push(level);
    } else {
      clusteredLevels.push({
        price: level.price,
        type: level.type,
        strength: 1,
        touches: [level],
      });
    }
  }

  // Sort by strength and return top levels
  return clusteredLevels
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 8)
    .map(l => ({
      price: l.price,
      type: l.type,
      strength: l.strength,
    }));
}

// Calculate EMA
function calculateEMA(data, period) {
  if (data.length < period) return [];

  const emaData = [];
  const closes = data.map(d => d.close);
  const multiplier = 2 / (period + 1);

  let sum = 0;
  for (let i = 0; i < period; i++) sum += closes[i];
  let ema = sum / period;

  emaData.push({
    date: data[period - 1].date,
    timestamp: data[period - 1].timestamp,
    value: parseFloat(ema.toFixed(2)),
  });

  for (let i = period; i < closes.length; i++) {
    ema = (closes[i] - ema) * multiplier + ema;
    emaData.push({
      date: data[i].date,
      timestamp: data[i].timestamp,
      value: parseFloat(ema.toFixed(2)),
    });
  }

  return emaData;
}

// Calculate Market Sniper Signal
function calculateSignal(data, rsiData, ema9, ema21) {
  const signals = [];

  for (let i = 0; i < data.length; i++) {
    const date = data[i].date;
    const rsi = rsiData.find(r => r.date === date);
    const shortEma = ema9.find(e => e.date === date);
    const longEma = ema21.find(e => e.date === date);

    if (!rsi || !shortEma || !longEma) continue;

    let signal = 'hold';
    let strength = 50;

    if (rsi.value < 30 && shortEma.value > longEma.value) {
      signal = 'strong_buy';
      strength = 90;
    } else if (rsi.value < 40 && shortEma.value > longEma.value) {
      signal = 'buy';
      strength = 70;
    } else if (rsi.value > 70 && shortEma.value < longEma.value) {
      signal = 'strong_sell';
      strength = 90;
    } else if (rsi.value > 60 && shortEma.value < longEma.value) {
      signal = 'sell';
      strength = 70;
    }

    signals.push({
      date,
      timestamp: data[i].timestamp,
      price: data[i].close,
      rsi: rsi.value,
      ema9: shortEma.value,
      ema21: longEma.value,
      signal,
      strength,
    });
  }

  return signals;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'RELIANCE.NS';
  const timeframe = searchParams.get('timeframe') || '15m';

  try {
    // Use Binance for crypto assets
    if (isCryptoSymbol(symbol)) {
      const interval = getBinanceInterval(timeframe);
      const [klineData, tickerData] = await Promise.all([
        fetchBinanceKlines(symbol, interval, 100),
        fetchBinancePrice(symbol),
      ]);

      if (!klineData || klineData.length < 10) {
        return NextResponse.json(
          { error: 'Failed to fetch Binance data', symbol },
          { status: 500 }
        );
      }

      // Calculate Market Sniper indicators
      const rsiData = calculateRSI(klineData, 14);

      // Market Sniper EMAs (Fast: 8, Mid: 34, Slow: 200)
      const emaFast = calculateEMA(klineData, 8);    // Fast EMA
      const emaMid = calculateEMA(klineData, 34);    // Mid EMA
      const emaSlow = calculateEMA(klineData, 200);  // Very Slow EMA
      const ema9 = calculateEMA(klineData, 9);       // For backward compatibility
      const ema21 = calculateEMA(klineData, 21);     // For backward compatibility

      // Support/Resistance levels
      const srLevels = calculateSRLevels(klineData, 15);

      // Market Sniper Oscillator
      const sniperOscillator = calculateSniperOscillator(klineData, 14, 3, 3);

      // Calculate signals using Market Sniper logic
      const signals = calculateSignal(klineData, rsiData, ema9, ema21);

      const currentSignal = signals.length > 0 ? signals[signals.length - 1] : null;
      const latestCandle = klineData[klineData.length - 1];

      // Get current EMA values for display
      const currentEmaFast = emaFast.length > 0 ? emaFast[emaFast.length - 1].value : null;
      const currentEmaMid = emaMid.length > 0 ? emaMid[emaMid.length - 1].value : null;
      const currentEmaSlow = emaSlow.length > 0 ? emaSlow[emaSlow.length - 1].value : null;

      return NextResponse.json({
        symbol,
        currency: 'USD',
        exchange: 'Binance',
        currentPrice: tickerData?.price || latestCandle.close,
        previousClose: tickerData?.prevClose || latestCandle.open,
        high24h: tickerData?.high24h,
        low24h: tickerData?.low24h,
        volume24h: tickerData?.volume24h,
        priceChangePercent: tickerData?.priceChangePercent,
        priceData: klineData,
        rsiData,
        // Market Sniper EMAs
        emaFast,
        emaMid,
        emaSlow,
        ema9,
        ema21,
        // Current EMA values for header display
        currentEmas: {
          fast: currentEmaFast,
          mid: currentEmaMid,
          slow: currentEmaSlow,
        },
        // S/R Levels
        srLevels,
        // Sniper Oscillator
        sniperOscillator,
        signals,
        currentSignal,
        isMarketOpen: true,
        marketStatus: 'open',
        timeframe,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Use Yahoo Finance for other assets
    const yahooData = await fetchYahooFinance(symbol);

    if (!yahooData) {
      return NextResponse.json(
        { error: 'Failed to fetch market data', symbol },
        { status: 500 }
      );
    }

    const stockData = formatStockData(yahooData, symbol);

    if (!stockData || stockData.data.length < 10) {
      return NextResponse.json(
        { error: 'Insufficient data', symbol },
        { status: 400 }
      );
    }

    // Calculate Market Sniper indicators
    const rsiData = calculateRSI(stockData.data, 14);

    // Market Sniper EMAs
    const emaFast = calculateEMA(stockData.data, 8);
    const emaMid = calculateEMA(stockData.data, 34);
    const emaSlow = calculateEMA(stockData.data, 200);
    const ema9 = calculateEMA(stockData.data, 9);
    const ema21 = calculateEMA(stockData.data, 21);

    // S/R Levels
    const srLevels = calculateSRLevels(stockData.data, 15);

    // Sniper Oscillator
    const sniperOscillator = calculateSniperOscillator(stockData.data, 14, 3, 3);

    const signals = calculateSignal(stockData.data, rsiData, ema9, ema21);
    const currentSignal = signals.length > 0 ? signals[signals.length - 1] : null;

    // Get the most recent price from data if regularMarketPrice is stale
    const latestCandle = stockData.data[stockData.data.length - 1];
    const currentPrice = stockData.regularMarketPrice || latestCandle?.close;

    // Get current EMA values
    const currentEmaFast = emaFast.length > 0 ? emaFast[emaFast.length - 1].value : null;
    const currentEmaMid = emaMid.length > 0 ? emaMid[emaMid.length - 1].value : null;
    const currentEmaSlow = emaSlow.length > 0 ? emaSlow[emaSlow.length - 1].value : null;

    return NextResponse.json({
      symbol: stockData.symbol,
      currency: stockData.currency,
      exchange: stockData.exchange,
      currentPrice,
      previousClose: stockData.previousClose,
      priceData: stockData.data,
      rsiData,
      emaFast,
      emaMid,
      emaSlow,
      ema9,
      ema21,
      currentEmas: {
        fast: currentEmaFast,
        mid: currentEmaMid,
        slow: currentEmaSlow,
      },
      srLevels,
      sniperOscillator,
      signals,
      currentSignal,
      isMarketOpen: stockData.isMarketOpen,
      marketStatus: stockData.marketStatus,
      lastTradeTime: stockData.lastTradeTime,
      timeframe,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Market data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data', symbol },
      { status: 500 }
    );
  }
}
