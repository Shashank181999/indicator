// Indicator calculation utilities

// Generate mock price data
export function generateMockPriceData(days = 100) {
  const data = [];
  let price = 100 + Math.random() * 50;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const change = (Math.random() - 0.5) * 4;
    price = Math.max(50, price + change);

    const high = price + Math.random() * 2;
    const low = price - Math.random() * 2;
    const open = low + Math.random() * (high - low);
    const close = low + Math.random() * (high - low);

    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
    });
  }

  return data;
}

// Calculate RSI (Relative Strength Index)
export function calculateRSI(data, period = 14) {
  if (data.length < period + 1) return [];

  const rsiData = [];
  const closes = data.map(d => d.close);

  for (let i = period; i < closes.length; i++) {
    let gains = 0;
    let losses = 0;

    for (let j = i - period + 1; j <= i; j++) {
      const change = closes[j] - closes[j - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    let rsi;
    if (avgLoss === 0) {
      rsi = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi = 100 - (100 / (1 + rs));
    }

    rsiData.push({
      date: data[i].date,
      timestamp: data[i].timestamp,
      value: parseFloat(rsi.toFixed(2)),
    });
  }

  return rsiData;
}

// Calculate EMA (Exponential Moving Average)
export function calculateEMA(data, period) {
  if (data.length < period) return [];

  const emaData = [];
  const closes = data.map(d => d.close);
  const multiplier = 2 / (period + 1);

  // Calculate initial SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += closes[i];
  }
  let ema = sum / period;

  emaData.push({
    date: data[period - 1].date,
    timestamp: data[period - 1].timestamp,
    value: parseFloat(ema.toFixed(2)),
  });

  // Calculate EMA for remaining data points
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
export function calculateMarketSniperSignal(data, rsiData, ema9, ema21) {
  const signals = [];

  // Align data by finding common dates
  for (let i = 0; i < data.length; i++) {
    const date = data[i].date;
    const rsi = rsiData.find(r => r.date === date);
    const shortEma = ema9.find(e => e.date === date);
    const longEma = ema21.find(e => e.date === date);

    if (!rsi || !shortEma || !longEma) continue;

    let signal = 'hold';
    let strength = 0;

    // Buy signal conditions
    if (rsi.value < 30 && shortEma.value > longEma.value) {
      signal = 'strong_buy';
      strength = 90;
    } else if (rsi.value < 40 && shortEma.value > longEma.value) {
      signal = 'buy';
      strength = 70;
    }
    // Sell signal conditions
    else if (rsi.value > 70 && shortEma.value < longEma.value) {
      signal = 'strong_sell';
      strength = 90;
    } else if (rsi.value > 60 && shortEma.value < longEma.value) {
      signal = 'sell';
      strength = 70;
    }
    // Neutral/Hold
    else {
      strength = 50;
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

// Get current signal summary
export function getCurrentSignal(signals) {
  if (signals.length === 0) return null;

  const latest = signals[signals.length - 1];

  return {
    signal: latest.signal,
    strength: latest.strength,
    price: latest.price,
    rsi: latest.rsi,
    ema9: latest.ema9,
    ema21: latest.ema21,
    date: latest.date,
  };
}
