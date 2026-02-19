'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  RefreshCw,
  BarChart3,
  LineChart,
  Maximize2,
  Minimize2,
  ChevronDown,
  X,
  HelpCircle,
  Clock,
  Search,
  Check,
} from 'lucide-react';

// Timeframe options
const TIMEFRAMES = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
];

// Asset categories with Binance symbols for crypto
const ASSET_CATEGORIES = {
  crypto: {
    name: 'Crypto',
    icon: '₿',
    assets: [
      { symbol: 'BTC-USD', binance: 'btcusdt', name: 'Bitcoin', short: 'BTC' },
      { symbol: 'ETH-USD', binance: 'ethusdt', name: 'Ethereum', short: 'ETH' },
      { symbol: 'SOL-USD', binance: 'solusdt', name: 'Solana', short: 'SOL' },
      { symbol: 'XRP-USD', binance: 'xrpusdt', name: 'Ripple', short: 'XRP' },
      { symbol: 'DOGE-USD', binance: 'dogeusdt', name: 'Dogecoin', short: 'DOGE' },
    ],
  },
  indices: {
    name: 'Indices',
    icon: '📊',
    assets: [
      { symbol: '^NSEI', name: 'Nifty 50', short: 'NIFTY' },
      { symbol: '^NSEBANK', name: 'Bank Nifty', short: 'BANKNIFTY' },
      { symbol: '^BSESN', name: 'Sensex', short: 'SENSEX' },
    ],
  },
  commodities: {
    name: 'Commodities',
    icon: '🥇',
    assets: [
      { symbol: 'GC=F', name: 'Gold', short: 'GOLD' },
      { symbol: 'SI=F', name: 'Silver', short: 'SILVER' },
      { symbol: 'CL=F', name: 'Crude Oil', short: 'OIL' },
    ],
  },
  stocks: {
    name: 'Stocks',
    icon: '📈',
    assets: [
      { symbol: 'RELIANCE.NS', name: 'Reliance', short: 'RELIANCE' },
      { symbol: 'TCS.NS', name: 'TCS', short: 'TCS' },
      { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', short: 'HDFC' },
      { symbol: 'INFY.NS', name: 'Infosys', short: 'INFY' },
    ],
  },
  forex: {
    name: 'Forex',
    icon: '💱',
    assets: [
      { symbol: 'USDINR=X', name: 'USD/INR', short: 'USDINR' },
      { symbol: 'EURUSD=X', name: 'EUR/USD', short: 'EURUSD' },
      { symbol: 'GBPUSD=X', name: 'GBP/USD', short: 'GBPUSD' },
    ],
  },
};

export default function MarketSniperIndicator() {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const wsRef = useRef(null);
  const priceHistoryRef = useRef([]);
  const latestPriceRef = useRef(null);
  const displayUpdateIntervalRef = useRef(null);
  const animationFrameRef = useRef(null);
  const drawChartRef = useRef(null);

  // Viewport state stored in refs for performance (no React re-renders on zoom/pan)
  // Separate viewports for chart and oscillator
  const chartViewportRef = useRef({
    startIndex: 0,
    endIndex: 100,
    candleWidth: 8,
    minCandleWidth: 2,
    maxCandleWidth: 25,
  });

  const oscViewportRef = useRef({
    startIndex: 0,
    endIndex: 100,
    candleWidth: 8,
    minCandleWidth: 2,
    maxCandleWidth: 25,
  });

  // Track which section is being interacted with
  const activeViewportRef = useRef('chart'); // 'chart' or 'osc'

  // Pan/drag state
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    velocityX: 0,
    velocityY: 0,
    inertiaFrame: null,
  });

  // Pinch zoom state for touch
  const pinchRef = useRef({
    isPinching: false,
    initialDistance: 0,
    initialCandleWidth: 8,
    centerX: 0,
  });

  
  // Crosshair/cursor tracking state
  const crosshairRef = useRef({
    x: null,
    y: null,
    visible: false,
  });

  const [selectedCategory, setSelectedCategory] = useState('crypto');
  const [selectedAsset, setSelectedAsset] = useState('BTC-USD');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(null);
  const [priceDirection, setPriceDirection] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [chartType, setChartType] = useState('candle');
  const [fullscreen, setFullscreen] = useState(false);
  const [iosViewportHeight, setIosViewportHeight] = useState(0);
  const [isIOSFullscreen, setIsIOSFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fullscreenContainerRef = useRef(null);
  const [timeframe, setTimeframe] = useState('15m');
  const [showAssetSearch, setShowAssetSearch] = useState(false);
  const [assetSearch, setAssetSearch] = useState('');
  const [showIndicatorMenu, setShowIndicatorMenu] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);

  const [indicators, setIndicators] = useState({
    emaFast: true,
    emaMid: true,
    emaSlow: true,
    srLevels: false,
    volume: true,
    sniperOsc: true,
    signals: true,
    fibRetracement: true,
    adaptiveTrend: true,
  });
  const [candleCountdown, setCandleCountdown] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileTimeframes, setShowMobileTimeframes] = useState(false);

  // Draggable divider state - ratio of main chart height to total (chart + oscillator)
  const [chartOscRatio, setChartOscRatio] = useState(0.57); // Default: 57% chart, 43% oscillator
  const dividerDragRef = useRef({
    isDragging: false,
    startY: 0,
    startRatio: 0.57,
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    setIsMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle fullscreen changes (native browser API)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
      setFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      // Cleanup body styles on unmount
      document.body.style.overflow = '';
    };
  }, []);

  // Detect iOS device (iPhone/iPad)
  const isIOS = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
           (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  }, []);

  // Toggle fullscreen function
  const toggleFullscreen = useCallback(() => {
    const container = fullscreenContainerRef.current;
    if (!container) return;

    // iOS doesn't support Fullscreen API - use Portal-based fullscreen
    if (isIOS()) {
      const entering = !fullscreen;

      if (entering) {
        // Store the actual viewport height for iOS
        const vh = window.innerHeight;
        setIosViewportHeight(vh);
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
      } else {
        document.body.style.overflow = '';
        setIosViewportHeight(0);
      }

      setIsIOSFullscreen(entering);
      setFullscreen(entering);
      return;
    }

    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);

    if (!isFs) {
      // Enter fullscreen
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else {
        // Fallback for browsers that don't support Fullscreen API
        setFullscreen(true);
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else {
        setFullscreen(false);
      }
    }
  }, [isIOS, fullscreen]);

  // Calculate candle countdown timer
  useEffect(() => {
    const getTimeframeMs = (tf) => {
      const map = {
        '1m': 60 * 1000,
        '5m': 5 * 60 * 1000,
        '15m': 15 * 60 * 1000,
        '30m': 30 * 60 * 1000,
        '1h': 60 * 60 * 1000,
        '4h': 4 * 60 * 60 * 1000,
        '1d': 24 * 60 * 60 * 1000,
        '1w': 7 * 24 * 60 * 60 * 1000,
      };
      return map[tf] || 60 * 1000;
    };

    const updateCountdown = () => {
      const now = Date.now();
      const tfMs = getTimeframeMs(timeframe);
      const currentCandleStart = Math.floor(now / tfMs) * tfMs;
      const nextCandleStart = currentCandleStart + tfMs;
      const remaining = nextCandleStart - now;

      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);

      if (tfMs >= 60 * 60 * 1000) {
        const hours = Math.floor(remaining / 3600000);
        const minsLeft = Math.floor((remaining % 3600000) / 60000);
        setCandleCountdown(`${hours}:${minsLeft.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      } else {
        setCandleCountdown(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [timeframe]);

  // Check if Indian market is open
  const checkIndianMarketOpen = useCallback(() => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffset);
    const day = ist.getUTCDay();
    const hours = ist.getUTCHours();
    const minutes = ist.getUTCMinutes();
    const time = hours * 60 + minutes;

    if (day === 0 || day === 6) return false;
    return time >= 9 * 60 + 15 && time <= 15 * 60 + 30;
  }, []);

  // Check if US market is open (for commodities/forex)
  const checkUSMarketOpen = useCallback(() => {
    const now = new Date();
    const estOffset = -5 * 60 * 60 * 1000;
    const est = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000 + estOffset);
    const day = est.getDay();
    const hours = est.getHours();
    const minutes = est.getMinutes();
    const time = hours * 60 + minutes;

    if (day === 0 || day === 6) return false;
    return time >= 9 * 60 + 30 && time <= 16 * 60;
  }, []);

  // Check if a specific category market is open
  const isMarketOpenForCategory = useCallback((category) => {
    if (category === 'crypto') return true; // Crypto is 24/7
    if (category === 'indices' || category === 'stocks') return checkIndianMarketOpen();
    if (category === 'commodities') return checkUSMarketOpen();
    if (category === 'forex') return true; // Forex is mostly 24/5
    return true;
  }, [checkIndianMarketOpen, checkUSMarketOpen]);

  // Get current asset info
  const getCurrentAsset = useCallback(() => {
    return Object.values(ASSET_CATEGORIES)
      .flatMap(c => c.assets)
      .find(a => a.symbol === selectedAsset);
  }, [selectedAsset]);

  // Connect to Binance WebSocket for real-time crypto prices
  const connectWebSocket = useCallback(() => {
    const asset = getCurrentAsset();
    if (!asset?.binance) return;

    if (wsRef.current) {
      wsRef.current.close();
    }

    if (displayUpdateIntervalRef.current) {
      clearInterval(displayUpdateIntervalRef.current);
    }

    const wsUrl = `wss://stream.binance.com:9443/ws/${asset.binance}@trade`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected for', asset.binance);
        setIsConnected(true);
        setError(null);

        displayUpdateIntervalRef.current = setInterval(() => {
          if (latestPriceRef.current !== null) {
            setDisplayPrice(currentDisplay => {
              const newPrice = latestPriceRef.current;
              if (currentDisplay !== null && currentDisplay !== newPrice) {
                setPriceDirection(newPrice > currentDisplay ? 'up' : newPrice < currentDisplay ? 'down' : null);
                setTimeout(() => setPriceDirection(null), 600);
              }
              return newPrice;
            });
            setLastUpdated(new Date());
          }
        }, 500);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newPrice = parseFloat(data.p);

        latestPriceRef.current = newPrice;
        setLivePrice(newPrice);

        priceHistoryRef.current.push({
          price: newPrice,
          time: Date.now(),
        });
        if (priceHistoryRef.current.length > 100) {
          priceHistoryRef.current.shift();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        if (displayUpdateIntervalRef.current) {
          clearInterval(displayUpdateIntervalRef.current);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setIsConnected(false);
    }
  }, [getCurrentAsset]);

  // Fetch historical data from API
  const fetchHistoricalData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/market-data?symbol=${selectedAsset}&timeframe=${timeframe}&t=${Date.now()}`);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      if (data.priceData && data.priceData.length > 0) {
        setMarketData(data);
        setIsMarketOpen(data.isMarketOpen !== false);

        // Initialize both viewports to show latest candles
        const candleCount = data.priceData.length;
        const defaultCandleWidth = 8;
        const visibleCount = Math.min(100, candleCount); // Show last 100 candles or all if less
        const startIdx = Math.max(0, candleCount - visibleCount);

        // Set viewports
        chartViewportRef.current.startIndex = startIdx;
        chartViewportRef.current.endIndex = candleCount;
        chartViewportRef.current.candleWidth = defaultCandleWidth;

        // Also sync target
        targetViewportRef.current.candleWidth = defaultCandleWidth;
        targetViewportRef.current.startIndex = startIdx;
        targetViewportRef.current.endIndex = candleCount;
        targetViewportRef.current.isAnimating = false;

        if (!livePrice) {
          setLivePrice(data.currentPrice);
          setDisplayPrice(data.currentPrice);
        }
        setError(null);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to fetch market data');
    } finally {
      setLoading(false);
    }
  }, [selectedAsset, timeframe, livePrice]);

  // Handle asset change
  useEffect(() => {
    setLivePrice(null);
    setDisplayPrice(null);
    setPriceDirection(null);
    priceHistoryRef.current = [];
    latestPriceRef.current = null;

    // Reset both viewports
    chartViewportRef.current = {
      startIndex: 0,
      endIndex: 100,
      candleWidth: 8,
      minCandleWidth: 2,
      maxCandleWidth: 25,
    };
    oscViewportRef.current = {
      startIndex: 0,
      endIndex: 100,
      candleWidth: 8,
      minCandleWidth: 2,
      maxCandleWidth: 25,
    };

    if (displayUpdateIntervalRef.current) {
      clearInterval(displayUpdateIntervalRef.current);
      displayUpdateIntervalRef.current = null;
    }

    const asset = getCurrentAsset();
    const isCrypto = selectedCategory === 'crypto' && asset?.binance;

    if (isCrypto) {
      connectWebSocket();
      setIsMarketOpen(true);
    } else {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);

      if (selectedCategory === 'indices' || selectedCategory === 'stocks') {
        setIsMarketOpen(checkIndianMarketOpen());
      }
    }

    fetchHistoricalData();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (displayUpdateIntervalRef.current) {
        clearInterval(displayUpdateIntervalRef.current);
      }
    };
  }, [selectedAsset, selectedCategory]);

  // Refresh historical data periodically for non-crypto
  useEffect(() => {
    if (selectedCategory !== 'crypto') {
      const interval = setInterval(() => {
        if (isMarketOpen) {
          fetchHistoricalData();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedCategory, isMarketOpen, fetchHistoricalData]);

  // Refetch when timeframe changes
  useEffect(() => {
    const defaultValues = {
      startIndex: 0,
      endIndex: 100,
      candleWidth: 8,
      minCandleWidth: 2,
      maxCandleWidth: 25,
    };
    chartViewportRef.current = { ...defaultValues };
    // Also reset target
    targetViewportRef.current.candleWidth = 8;
    targetViewportRef.current.startIndex = 0;
    targetViewportRef.current.endIndex = 100;
    targetViewportRef.current.isAnimating = false;
    fetchHistoricalData();
  }, [timeframe]);

  // ============================================
  // TRADINGVIEW-STYLE ZOOM & PAN IMPLEMENTATION
  // ============================================

  // Target viewport values for smooth animation (single viewport for both chart and oscillator)
  const targetViewportRef = useRef({
    candleWidth: 8,
    startIndex: 0,
    endIndex: 100,
    isAnimating: false,
  });

  // Smooth animation loop - interpolates viewport towards target
  const animateViewport = useCallback(() => {
    const target = targetViewportRef.current;
    const vp = chartViewportRef.current;

    // Lerp factor - 1.0 = instant (no interpolation lag)
    const lerp = 1.0;

    // Interpolate towards target
    vp.candleWidth += (target.candleWidth - vp.candleWidth) * lerp;
    vp.startIndex += (target.startIndex - vp.startIndex) * lerp;
    vp.endIndex += (target.endIndex - vp.endIndex) * lerp;

    // Check if close enough to stop
    const diff = Math.abs(target.candleWidth - vp.candleWidth) +
                 Math.abs(target.startIndex - vp.startIndex) +
                 Math.abs(target.endIndex - vp.endIndex);

    // Use ref for latest drawChart
    if (drawChartRef.current) {
      drawChartRef.current();
    }

    if (diff > 0.01) {
      animationFrameRef.current = requestAnimationFrame(animateViewport);
    } else {
      // Snap to final values
      vp.candleWidth = target.candleWidth;
      vp.startIndex = target.startIndex;
      vp.endIndex = target.endIndex;
      target.isAnimating = false;
      animationFrameRef.current = null;
      if (drawChartRef.current) {
        drawChartRef.current();
      }
    }
  }, []);

  // Schedule render - just draws without animation
  // Uses ref to always get latest drawChart (avoids stale closure)
  const scheduleRender = useCallback(() => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        animationFrameRef.current = null;
        if (drawChartRef.current) {
          drawChartRef.current();
        }
      });
    }
  }, []);

  // Calculate visible range from viewport state
  const getVisibleRange = useCallback((priceData, chartWidth, viewportRef) => {
    if (!priceData || priceData.length === 0) return { start: 0, end: 0, candleWidth: 8 };

    const viewport = viewportRef.current;
    const candleCount = priceData.length;

    // Calculate how many candles fit in the chart width
    // Subtract 3 for safety margin to prevent candles from overflowing
    const visibleCandleCount = Math.max(3, Math.floor(chartWidth / viewport.candleWidth) - 3);

    // Clamp indices
    let endIndex = Math.min(viewport.endIndex, candleCount);
    let startIndex = Math.max(0, endIndex - visibleCandleCount);

    // Ensure we don't go past the data
    if (startIndex < 0) {
      startIndex = 0;
      endIndex = Math.min(visibleCandleCount, candleCount);
    }

    return {
      start: Math.floor(startIndex),
      end: Math.ceil(endIndex),
      candleWidth: viewport.candleWidth,
    };
  }, []);

  // Smooth zoom handler
  const handleZoom = useCallback((deltaY, clientX, clientY) => {
    const canvas = chartRef.current;
    if (!canvas || !marketData?.priceData) return;

    const rect = canvas.getBoundingClientRect();
    const chartWidth = rect.width - 90; // Right padding for price labels
    const candleCount = marketData.priceData.length;

    const viewport = chartViewportRef.current;
    const target = targetViewportRef.current;

    // Use current target as base (for continuous zooming)
    const baseWidth = target.candleWidth || viewport.candleWidth;
    const baseStart = target.startIndex !== undefined ? target.startIndex : viewport.startIndex;

    // Zoom factor - exponential for consistent feel
    // Scroll DOWN = zoom IN (bigger candles), Scroll UP = zoom OUT (smaller candles)
    const zoomFactor = Math.exp(deltaY * 0.002);

    // Calculate new candle width
    const newWidth = Math.max(
      viewport.minCandleWidth,
      Math.min(viewport.maxCandleWidth, baseWidth * zoomFactor)
    );

    // Calculate visible candles (subtract 3 for safety margin)
    const newVisibleCount = Math.max(3, chartWidth / newWidth - 3);

    // ANCHOR TO RIGHT: Keep endIndex at the latest candle, adjust startIndex
    let newEnd = candleCount;
    let newStart = Math.max(0, candleCount - newVisibleCount);

    // If user has scrolled left (viewing history), maintain relative position
    if (viewport.endIndex < candleCount - 1) {
      const currentEndOffset = candleCount - viewport.endIndex;
      newEnd = candleCount - currentEndOffset;
      newStart = Math.max(0, newEnd - newVisibleCount);
    }

    // Set TARGET values
    target.candleWidth = newWidth;
    target.startIndex = newStart;
    target.endIndex = newEnd;

    // Start animation if not running
    if (!target.isAnimating) {
      target.isAnimating = true;
      animationFrameRef.current = requestAnimationFrame(animateViewport);
    }
  }, [marketData, animateViewport]);

  // Smooth pan handler
  const handlePan = useCallback((deltaX) => {
    if (!marketData?.priceData) return;

    const viewport = chartViewportRef.current;
    const target = targetViewportRef.current;
    const candleCount = marketData.priceData.length;

    // Use current target as base
    const baseStart = target.startIndex !== undefined ? target.startIndex : viewport.startIndex;
    const baseEnd = target.endIndex !== undefined ? target.endIndex : viewport.endIndex;
    const baseWidth = target.candleWidth || viewport.candleWidth;

    // Convert pixel delta to index delta
    const indexDelta = -deltaX / baseWidth;
    const visibleCount = baseEnd - baseStart;

    // Calculate new indices
    let newStart = baseStart + indexDelta;
    let newEnd = baseEnd + indexDelta;

    // Clamp
    if (newStart < 0) {
      newStart = 0;
      newEnd = visibleCount;
    }
    if (newEnd > candleCount) {
      newEnd = candleCount;
      newStart = Math.max(0, candleCount - visibleCount);
    }

    // Set TARGET values
    target.startIndex = newStart;
    target.endIndex = newEnd;
    target.candleWidth = baseWidth;

    // Start animation if not running
    if (!target.isAnimating) {
      target.isAnimating = true;
      animationFrameRef.current = requestAnimationFrame(animateViewport);
    }
  }, [marketData, animateViewport]);

  // Inertia animation for smooth stopping - Mobile optimized
  const startInertia = useCallback(() => {
    const drag = dragRef.current;

    // Amplify initial velocity for more natural mobile feel
    drag.velocityX *= 1.5;

    const animate = () => {
      if (Math.abs(drag.velocityX) < 0.3) {
        drag.velocityX = 0;
        return;
      }

      handlePan(drag.velocityX);
      // Smoother deceleration curve for mobile
      drag.velocityX *= 0.92;

      drag.inertiaFrame = requestAnimationFrame(animate);
    };

    drag.inertiaFrame = requestAnimationFrame(animate);
  }, [handlePan]);

  // Stop inertia animation
  const stopInertia = useCallback(() => {
    const drag = dragRef.current;
    if (drag.inertiaFrame) {
      cancelAnimationFrame(drag.inertiaFrame);
      drag.inertiaFrame = null;
    }
  }, []);

  // Helper to detect which section (chart or oscillator) based on Y position
  const detectSection = useCallback((clientY) => {
    const canvas = chartRef.current;
    if (!canvas) return 'chart';

    const rect = canvas.getBoundingClientRect();
    const height = rect.height;
    const relativeY = clientY - rect.top;

    const oscStartPercent = indicators.sniperOsc ? 0.60 : 1;
    const oscStart = height * oscStartPercent;

    if (relativeY > oscStart && indicators.sniperOsc) {
      return 'osc';
    }
    return 'chart';
  }, [indicators.sniperOsc]);

  // Mouse wheel handler - TradingView-style instant response with smooth animation
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault();

      // Normalize delta
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= 100;

      // Scale for consistent feel (smaller = more responsive)
      delta = delta * 0.6;

      handleZoom(delta, e.clientX, e.clientY);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleZoom]);

  // Mouse drag handlers
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    let currentViewport = chartViewportRef;

    const handleMouseDown = (e) => {
      stopInertia();
      const section = detectSection(e.clientY);
      activeViewportRef.current = section;
      currentViewport = section === 'osc' ? oscViewportRef : chartViewportRef;

      const drag = dragRef.current;
      drag.isDragging = true;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.lastX = e.clientX;
      drag.velocityX = 0;
      canvas.style.cursor = 'grabbing';

      crosshairRef.current.visible = false;
      scheduleRender();
    };

    const handleMouseMove = (e) => {
      const drag = dragRef.current;
      if (!drag.isDragging) return;

      const deltaX = e.clientX - drag.lastX;
      drag.velocityX = deltaX;
      drag.lastX = e.clientX;

      handlePan(deltaX);
    };

    const handleMouseUp = () => {
      const drag = dragRef.current;
      if (!drag.isDragging) return;

      drag.isDragging = false;
      canvas.style.cursor = 'crosshair';

      if (Math.abs(drag.velocityX) > 2) {
        startInertia();
      }
    };

    const handleMouseLeave = () => {
      const drag = dragRef.current;
      if (drag.isDragging) {
        drag.isDragging = false;
        canvas.style.cursor = 'crosshair';
        if (Math.abs(drag.velocityX) > 2) {
          startInertia();
        }
      }
      crosshairRef.current.visible = false;
      scheduleRender();
    };

    const handleMouseMoveForCrosshair = (e) => {
      const drag = dragRef.current;
      if (drag.isDragging) return;

      const rect = canvas.getBoundingClientRect();
      crosshairRef.current.x = e.clientX - rect.left;
      crosshairRef.current.y = e.clientY - rect.top;
      crosshairRef.current.visible = true;
      scheduleRender();
    };

    const handleMouseEnter = () => {
      crosshairRef.current.visible = true;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMoveForCrosshair);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMoveForCrosshair);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handlePan, startInertia, stopInertia, scheduleRender]);

  // Touch handlers for pinch-to-zoom and drag - Mobile optimized
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const getTouchDistance = (touches) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchCenter = (touches) => {
      if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY };
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
      };
    };

    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;
    let isHorizontalDrag = false;
    let directionDecided = false;
    let currentTouchViewport = chartViewportRef;
    let lastTouchX = 0;
    let lastTouchTime = 0;

    const handleTouchStart = (e) => {
      stopInertia();
      touchStartTime = Date.now();

      if (e.touches.length === 2) {
        e.preventDefault();
        const center = getTouchCenter(e.touches);
        const section = detectSection(center.y);
        activeViewportRef.current = section;
        currentTouchViewport = section === 'osc' ? oscViewportRef : chartViewportRef;

        const pinch = pinchRef.current;
        pinch.isPinching = true;
        pinch.initialDistance = getTouchDistance(e.touches);
        pinch.initialCandleWidth = currentTouchViewport.current.candleWidth;
        pinch.centerX = center.x;
        directionDecided = true;
        isHorizontalDrag = false;
      } else if (e.touches.length === 1) {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        lastTouchX = touchStartX;
        lastTouchTime = touchStartTime;

        const section = detectSection(e.touches[0].clientY);
        activeViewportRef.current = section;
        currentTouchViewport = section === 'osc' ? oscViewportRef : chartViewportRef;

        directionDecided = false;
        isHorizontalDrag = false;

        const drag = dragRef.current;
        drag.isDragging = false;
        drag.startX = e.touches[0].clientX;
        drag.lastX = e.touches[0].clientX;
        drag.velocityX = 0;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && pinchRef.current.isPinching) {
        e.preventDefault();
        const pinch = pinchRef.current;
        const currentDistance = getTouchDistance(e.touches);
        const scale = currentDistance / pinch.initialDistance;

        const center = getTouchCenter(e.touches);

        const newCandleWidth = Math.max(
          currentTouchViewport.current.minCandleWidth,
          Math.min(currentTouchViewport.current.maxCandleWidth, pinch.initialCandleWidth * scale)
        );

        // Pinch zoom - SYNCS BOTH viewports
        const viewport = chartViewportRef.current;
        const rect = canvas.getBoundingClientRect();
        const chartWidth = rect.width - 90; // Right padding for price labels
        const priceData = marketData?.priceData;

        if (priceData) {
          const candleCount = priceData.length;
          const newVisibleCount = Math.max(3, chartWidth / newCandleWidth - 3);

          // ANCHOR TO RIGHT: Keep most recent candles visible
          let newEnd = candleCount;
          let newStart = Math.max(0, candleCount - newVisibleCount);

          // If user has scrolled left (viewing history), maintain relative position
          if (viewport.endIndex < candleCount - 1) {
            const currentEndOffset = candleCount - viewport.endIndex;
            newEnd = candleCount - currentEndOffset;
            newStart = Math.max(0, newEnd - newVisibleCount);
          }

          // Apply to BOTH viewports (instant for touch responsiveness)
          chartViewportRef.current.candleWidth = newCandleWidth;
          chartViewportRef.current.startIndex = newStart;
          chartViewportRef.current.endIndex = newEnd;

          // Also update target to stay in sync
          targetViewportRef.current.candleWidth = newCandleWidth;
          targetViewportRef.current.startIndex = newStart;
          targetViewportRef.current.endIndex = newEnd;

          scheduleRender();
        }

        pinch.initialCandleWidth = newCandleWidth;
        pinch.initialDistance = currentDistance;

      } else if (e.touches.length === 1 && !pinchRef.current.isPinching) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (!directionDecided) {
          const absX = Math.abs(deltaX);
          const absY = Math.abs(deltaY);

          // Lower threshold for faster response on mobile (5px instead of 10px)
          if (absX > 5 || absY > 5) {
            directionDecided = true;
            // More lenient horizontal detection for chart panning
            isHorizontalDrag = absX > absY * 0.8;

            if (isHorizontalDrag) {
              dragRef.current.isDragging = true;
              dragRef.current.lastX = touch.clientX;
            }
          }
        }

        if (directionDecided && isHorizontalDrag) {
          e.preventDefault();
          const drag = dragRef.current;
          const moveDeltaX = touch.clientX - drag.lastX;

          // Smooth velocity calculation with momentum
          const now = Date.now();
          const timeDelta = now - lastTouchTime || 16;
          drag.velocityX = moveDeltaX * (16 / timeDelta); // Normalize to ~60fps
          drag.lastX = touch.clientX;
          lastTouchX = touch.clientX;
          lastTouchTime = now;

          handlePan(moveDeltaX);
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        pinchRef.current.isPinching = false;
      }

      if (e.touches.length === 0) {
        const drag = dragRef.current;

        if (drag.isDragging && isHorizontalDrag && Math.abs(drag.velocityX) > 2) {
          startInertia();
        }

        drag.isDragging = false;
        directionDecided = false;
        isHorizontalDrag = false;
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleZoom, handlePan, startInertia, stopInertia]);

  // Divider drag handlers for resizing chart/oscillator sections
  const handleDividerStart = useCallback((clientY) => {
    dividerDragRef.current = {
      isDragging: true,
      startY: clientY,
      startRatio: chartOscRatio,
    };
  }, [chartOscRatio]);

  const handleDividerMove = useCallback((clientY) => {
    if (!dividerDragRef.current.isDragging) return;

    const canvas = chartRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const deltaY = clientY - dividerDragRef.current.startY;

    // Convert pixel movement to ratio change
    // Moving down = larger chart (higher ratio), moving up = smaller chart (lower ratio)
    const ratioChange = deltaY / rect.height;
    let newRatio = dividerDragRef.current.startRatio + ratioChange;

    // Clamp ratio between 0.25 and 0.85 (oscillator gets at least 15%, chart gets at least 25%)
    newRatio = Math.max(0.25, Math.min(0.85, newRatio));

    setChartOscRatio(newRatio);
  }, []);

  const handleDividerEnd = useCallback(() => {
    dividerDragRef.current.isDragging = false;
  }, []);

  // Mouse events for divider (desktop)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dividerDragRef.current.isDragging) {
        e.preventDefault();
        handleDividerMove(e.clientY);
      }
    };

    const handleMouseUp = () => {
      if (dividerDragRef.current.isDragging) {
        handleDividerEnd();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleDividerMove, handleDividerEnd]);

  // Touch events for divider (mobile)
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (dividerDragRef.current.isDragging && e.touches.length === 1) {
        e.preventDefault();
        handleDividerMove(e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      if (dividerDragRef.current.isDragging) {
        handleDividerEnd();
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleDividerMove, handleDividerEnd]);

  // ResizeObserver for responsive handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        if (marketData) {
          drawChart();
        }
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [marketData]);

  // Keep drawChartRef updated with latest drawChart function
  // This ensures scheduleRender always uses the current chartType
  useEffect(() => {
    drawChartRef.current = drawChart;
  });

  // Draw chart when data changes
  useEffect(() => {
    if (chartRef.current && marketData) {
      drawChart();
    }
  }, [marketData, livePrice, chartType, indicators, candleCountdown, chartOscRatio]);

  // Force redraw on fullscreen change with delay for iOS
  useEffect(() => {
    if (!marketData) return;

    const redraw = () => {
      const canvas = chartRef.current;
      const container = containerRef.current;
      if (!canvas) return;

      let width, height;

      if (fullscreen) {
        // Use window dimensions minus header height (44px + 10px safe area = 54px)
        width = window.innerWidth;
        height = window.innerHeight - 54;
      } else {
        width = container?.offsetWidth || canvas.parentElement?.offsetWidth || canvas.offsetWidth;
        height = canvas.offsetHeight;
      }

      if (width === 0 || height === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      drawChart();
    };

    // Multiple redraws for iOS - more aggressive timing
    const timers = [0, 50, 150, 300, 500, 800, 1200].map(delay =>
      setTimeout(redraw, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [fullscreen, iosViewportHeight, isIOSFullscreen]);

  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopInertia();
    };
  }, [stopInertia]);

  const drawChart = () => {
    const canvas = chartRef.current;
    if (!canvas || !marketData?.priceData) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(2, window.devicePixelRatio || 2);
    const isSmallScreen = rect.width < 500;
    const isFullscreenMode = rect.height > 600;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Scale fonts based on screen size - larger for fullscreen
    const fontSize = isSmallScreen ? 10 : (isFullscreenMode ? 12 : 11);
    const fontSizeSmall = isSmallScreen ? 9 : (isFullscreenMode ? 11 : 10);

    const width = rect.width;
    const height = rect.height;
    let { priceData, signals } = marketData;

    // Update last candle with live price
    if (livePrice && priceData.length > 0) {
      priceData = [...priceData];
      const lastCandle = { ...priceData[priceData.length - 1] };
      lastCandle.close = livePrice;
      lastCandle.high = Math.max(lastCandle.high, livePrice);
      lastCandle.low = Math.min(lastCandle.low, livePrice);
      priceData[priceData.length - 1] = lastCandle;
    }

    const timeAxisHeight = 20;
    // Less padding on mobile
    const rightPadding = isSmallScreen ? 40 : 90;
    const padding = { top: 8, right: rightPadding, bottom: 5, left: 0 };
    const chartRightMargin = 0; // Margin built into padding.right
    const chartWidth = width - padding.left - padding.right - chartRightMargin;
    const availableHeight = height - timeAxisHeight - padding.top - padding.bottom;

    let mainChartHeight, volumeHeight, sniperOscHeight;
    if (indicators.sniperOsc && indicators.volume) {
      // Use dynamic ratio controlled by divider
      const chartPortion = chartOscRatio;
      const oscPortion = 1 - chartOscRatio;
      // Volume takes a small fixed portion from chart area
      volumeHeight = availableHeight * 0.08;
      const remainingHeight = availableHeight - volumeHeight;
      mainChartHeight = remainingHeight * chartPortion;
      sniperOscHeight = remainingHeight * oscPortion;
    } else if (indicators.sniperOsc) {
      // Use dynamic ratio controlled by divider
      mainChartHeight = availableHeight * chartOscRatio;
      volumeHeight = 0;
      sniperOscHeight = availableHeight * (1 - chartOscRatio);
    } else if (indicators.volume) {
      mainChartHeight = availableHeight * 0.88;
      volumeHeight = availableHeight * 0.12;
      sniperOscHeight = 0;
    } else {
      mainChartHeight = availableHeight;
      volumeHeight = 0;
      sniperOscHeight = 0;
    }

    // Clear with TradingView-style dark background
    ctx.fillStyle = '#131722';
    ctx.fillRect(0, 0, width, height);

    // Get visible range from chart viewport
    const chartVisibleRange = getVisibleRange(priceData, chartWidth, chartViewportRef);
    const startIdx = chartVisibleRange.start;
    const endIdx = chartVisibleRange.end;
    const candleWidth = chartVisibleRange.candleWidth;
    const visibleData = priceData.slice(startIdx, endIdx);

    // Use SAME viewport for oscillator (keeps them synced)
    const oscStartIdx = startIdx;
    const oscEndIdx = endIdx;
    const oscCandleWidth = candleWidth;

    if (visibleData.length === 0) return;

    // Calculate price range for visible data only
    const visiblePrices = visibleData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...visiblePrices) * 0.9998;
    const maxPrice = Math.max(...visiblePrices) * 1.0002;
    const priceRange = maxPrice - minPrice;

    const gap = candleWidth;
    const bodyWidth = Math.max(1, candleWidth * 0.7);
    const wickWidth = Math.max(0.5, bodyWidth / 6);

    const mainChartTop = padding.top;

    // Chart boundary where candles stop
    const clipBoundary = width - padding.right - chartRightMargin;

    // Simple left-to-right positioning
    const getX = (visibleIdx) => padding.left + visibleIdx * gap + gap / 2;

    // Use all visible data
    const drawableData = visibleData;
    const candlesToSkip = 0;
    const getY = (price) => mainChartTop + ((maxPrice - price) / priceRange) * (mainChartHeight - 15);

    // Time label formatter
    const formatTimeLabel = (timestamp, tf) => {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const day = date.getDate();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');

      if (tf === '1m' || tf === '5m' || tf === '15m' || tf === '30m' || tf === '1h') {
        return `${hours}:${minutes}`;
      } else if (tf === '4h') {
        return `${day}/${month} ${hours}:00`;
      } else {
        return `${day}/${month}`;
      }
    };

    const totalChartBottom = padding.top + mainChartHeight + volumeHeight + sniperOscHeight;
    const timeAxisY = height - 4;

    // Draw time axis BEFORE clipping (spans all sections)
    ctx.font = `400 ${fontSizeSmall}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
    ctx.textAlign = 'center';
    const timeLabelsCount = isSmallScreen ? 4 : (isFullscreenMode ? 8 : 6);
    const step = Math.max(1, Math.floor(drawableData.length / timeLabelsCount));

    for (let i = step; i < drawableData.length - 1; i += step) {
      const x = getX(i);
      const candle = drawableData[i];
      if (candle?.timestamp && x < clipBoundary) {
        ctx.strokeStyle = '#1e222d';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, totalChartBottom);
        ctx.stroke();

        ctx.fillStyle = '#787b86';
        ctx.fillText(formatTimeLabel(candle.timestamp, timeframe), x, timeAxisY);
      }
    }

    // Current time label - keep within chart boundary
    if (drawableData.length > 0 && endIdx >= priceData.length - 1) {
      const lastCandle = drawableData[drawableData.length - 1];
      const lastX = getX(drawableData.length - 1);
      if (lastCandle?.timestamp && lastX < clipBoundary) {
        const label = formatTimeLabel(lastCandle.timestamp, timeframe);
        ctx.font = `500 ${fontSizeSmall}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
        const labelWidth = ctx.measureText(label).width + 8;
        ctx.fillStyle = '#2962ff';
        // Keep label within clipBoundary
        const bgX = Math.min(lastX - labelWidth/2, clipBoundary - labelWidth - 5);
        ctx.fillRect(bgX, height - 16, labelWidth, 13);
        ctx.fillStyle = '#fff';
        ctx.fillText(label, bgX + labelWidth/2, timeAxisY);
      }
    }

    // Draw grid lines for main chart section
    ctx.strokeStyle = '#1e222d';
    ctx.lineWidth = 0.5;
    const gridLevels = 5;
    for (let i = 0; i <= gridLevels; i++) {
      const y = padding.top + (i / gridLevels) * (mainChartHeight - 15);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Clip main chart drawing to prevent overflow into price label area AND volume/oscillator sections
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, mainChartTop, clipBoundary, mainChartHeight);
    ctx.clip();

    // Draw candles or line (use drawableData which is limited to fit)
    if (chartType === 'candle') {
      drawableData.forEach((d, i) => {
        const x = getX(i);
        const isGreen = d.close >= d.open;
        const bullColor = '#26a69a';
        const bearColor = '#ef5350';
        const color = isGreen ? bullColor : bearColor;

        ctx.strokeStyle = color;
        ctx.lineWidth = wickWidth;
        ctx.beginPath();
        ctx.moveTo(x, getY(d.high));
        ctx.lineTo(x, getY(d.low));
        ctx.stroke();

        const bodyTop = getY(Math.max(d.open, d.close));
        const bodyBottom = getY(Math.min(d.open, d.close));
        const bodyHeight = Math.max(1, bodyBottom - bodyTop);

        ctx.fillStyle = color;
        ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
      });
    } else {
      const isUp = drawableData[drawableData.length - 1]?.close >= drawableData[0]?.open;
      ctx.beginPath();
      ctx.strokeStyle = isUp ? '#26a69a' : '#ef5350';
      ctx.lineWidth = 1.5;
      drawableData.forEach((d, i) => {
        const x = getX(i);
        const y = getY(d.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      const lastX = getX(drawableData.length - 1);
      const firstX = getX(0);
      ctx.lineTo(lastX, mainChartHeight);
      ctx.lineTo(firstX, mainChartHeight);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, mainChartHeight);
      gradient.addColorStop(0, isUp ? 'rgba(38, 166, 154, 0.12)' : 'rgba(239, 83, 80, 0.12)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // EMAs, Fibonacci, Adaptive Trend are drawn inside the clip region

    // Draw EMAs
    // Smooth line drawing with bezier curves
    const drawSmoothLine = (points, color, lineWidth = 1, useBezier = true) => {
      if (!points || points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.moveTo(points[0].x, points[0].y);

      if (useBezier && points.length > 2) {
        // Use quadratic bezier curves for smooth lines
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        // Draw the last segment
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);
      } else {
        // Fallback to straight lines
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }

      ctx.stroke();
    };

    const drawEMA = (emaData, color, lineWidth = 1) => {
      if (!emaData || emaData.length === 0) return;

      // Build points array for smooth drawing
      const points = [];
      emaData.forEach((e) => {
        const globalIdx = priceData.findIndex(p => p.date === e.date);
        if (globalIdx < startIdx || globalIdx >= endIdx) return;
        const visibleIdx = globalIdx - startIdx;
        const x = getX(visibleIdx);
        const y = getY(e.value);
        points.push({ x, y });
      });

      drawSmoothLine(points, color, lineWidth, true);
    };

    const { emaFast, emaMid, emaSlow } = marketData;
    if (indicators.emaFast && emaFast) drawEMA(emaFast, '#00bcd4', 1);
    if (indicators.emaMid && emaMid) drawEMA(emaMid, '#ffca28', 1);
    if (indicators.emaSlow && emaSlow) drawEMA(emaSlow, '#e91e63', 1.5);

    // Draw Adaptive Trend Indicator
    if (indicators.adaptiveTrend && priceData.length > 20) {
      const period = 14;
      const atrPeriod = 14;
      const multiplier = 2;

      let atrValues = [];
      for (let i = 1; i < priceData.length; i++) {
        const high = priceData[i].high;
        const low = priceData[i].low;
        const prevClose = priceData[i - 1].close;
        const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
        atrValues.push(tr);
      }

      let smoothedATR = [];
      for (let i = 0; i < atrValues.length; i++) {
        const start = Math.max(0, i - atrPeriod + 1);
        const slice = atrValues.slice(start, i + 1);
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        smoothedATR.push(avg);
      }

      let trendLine = [];
      let upperBand = [];
      let lowerBand = [];
      let trendDirection = [];

      const emaMult = 2 / (period + 1);
      let emaPrev = priceData[0].close;

      for (let i = 0; i < priceData.length; i++) {
        const close = priceData[i].close;
        const emaVal = (close - emaPrev) * emaMult + emaPrev;
        emaPrev = emaVal;

        const atr = smoothedATR[Math.max(0, i - 1)] || (priceData[i].high - priceData[i].low);
        const upper = emaVal + (atr * multiplier);
        const lower = emaVal - (atr * multiplier);

        trendLine.push({ x: i, value: emaVal, date: priceData[i].date });
        upperBand.push({ x: i, value: upper, date: priceData[i].date });
        lowerBand.push({ x: i, value: lower, date: priceData[i].date });

        const isBullish = close > emaVal;
        trendDirection.push(isBullish);
      }

      // Draw filled cloud
      for (let i = startIdx + 1; i < endIdx && i < priceData.length; i++) {
        const visibleIdx = i - startIdx;
        const x1 = getX(visibleIdx - 1);
        const x2 = getX(visibleIdx);
        const isBullish = trendDirection[i];

        const upperY1 = getY(upperBand[i - 1].value);
        const upperY2 = getY(upperBand[i].value);
        const lowerY1 = getY(lowerBand[i - 1].value);
        const lowerY2 = getY(lowerBand[i].value);

        ctx.beginPath();
        ctx.moveTo(x1, upperY1);
        ctx.lineTo(x2, upperY2);
        ctx.lineTo(x2, lowerY2);
        ctx.lineTo(x1, lowerY1);
        ctx.closePath();
        ctx.fillStyle = isBullish ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)';
        ctx.fill();
      }

      // Draw trend line with color
      for (let i = startIdx + 1; i < endIdx && i < trendLine.length; i++) {
        const visibleIdx = i - startIdx;
        const x1 = getX(visibleIdx - 1);
        const x2 = getX(visibleIdx);
        const y1 = getY(trendLine[i - 1].value);
        const y2 = getY(trendLine[i].value);
        const isBullish = trendDirection[i];

        ctx.beginPath();
        ctx.strokeStyle = isBullish ? '#10b981' : '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Trend label - Only show on larger screens to save space on mobile
      if (!isSmallScreen) {
        const isBullishTrend = trendDirection[trendDirection.length - 1];
        const trendText = isBullishTrend ? 'BULL' : 'BEAR';
        const trendColor = isBullishTrend ? '#10b981' : '#ef4444';

        ctx.font = `600 ${fontSizeSmall}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
        const trendWidth = ctx.measureText(trendText).width + 16;

        // Draw badge background
        ctx.fillStyle = isBullishTrend ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
        ctx.beginPath();
        ctx.roundRect(width - padding.right - trendWidth - 5, padding.top + 2, trendWidth, 18, 4);
        ctx.fill();

        // Draw text
        ctx.fillStyle = trendColor;
        ctx.textAlign = 'center';
        ctx.fillText(trendText, width - padding.right - trendWidth/2 - 5, padding.top + 14);
      }
    }

    // Draw Auto Fibonacci Retracement
    if (indicators.fibRetracement && priceData.length > 10) {
      let swingHighIdx = priceData.length - 1;
      let swingHighPrice = 0;
      for (let i = Math.max(0, priceData.length - 50); i < priceData.length; i++) {
        if (priceData[i].high > swingHighPrice) {
          swingHighPrice = priceData[i].high;
          swingHighIdx = i;
        }
      }

      let swingLowIdx = priceData.length - 1;
      let swingLowPrice = Infinity;
      for (let i = Math.max(0, priceData.length - 50); i < priceData.length; i++) {
        if (priceData[i].low < swingLowPrice) {
          swingLowPrice = priceData[i].low;
          swingLowIdx = i;
        }
      }

      const isUptrend = swingLowIdx < swingHighIdx;
      const highPrice = swingHighPrice;
      const lowPrice = swingLowPrice;
      const range = highPrice - lowPrice;

      const fibLevels = [
        { level: 0, color: '#2962ff', label: '0' },
        { level: 0.236, color: '#26a69a', label: '0.236' },
        { level: 0.382, color: '#26a69a', label: '0.382' },
        { level: 0.5, color: '#ffca28', label: '0.5' },
        { level: 0.618, color: '#ff9800', label: '0.618' },
        { level: 0.786, color: '#ef5350', label: '0.786' },
        { level: 1, color: '#9c27b0', label: '1' },
      ];

      fibLevels.forEach((fib) => {
        let fibPrice;
        if (isUptrend) {
          fibPrice = highPrice - (range * fib.level);
        } else {
          fibPrice = lowPrice + (range * fib.level);
        }

        const y = getY(fibPrice);
        if (y < padding.top + 5 || y > mainChartTop + mainChartHeight - 5) return;

        // Draw subtle dashed line
        ctx.strokeStyle = fib.color;
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right - 45, y); // Stop before label area
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Draw compact label on LEFT side of chart
        const labelText = fib.label;
        ctx.font = `500 ${isSmallScreen ? 8 : (isFullscreenMode ? 10 : 9)}px -apple-system, BlinkMacSystemFont, sans-serif`;
        const labelWidth = ctx.measureText(labelText).width + 6;

        // Background for label
        ctx.fillStyle = 'rgba(19, 23, 34, 0.85)';
        ctx.fillRect(5, y - 7, labelWidth, 14);

        // Label text
        ctx.fillStyle = fib.color;
        ctx.textAlign = 'left';
        ctx.fillText(labelText, 8, y + 3);
      });
    }

    // Draw signals
    if (indicators.signals && signals) {
      signals.forEach((sig) => {
        if (sig.signal === 'hold') return;
        const globalIdx = priceData.findIndex(p => p.date === sig.date);
        if (globalIdx < startIdx || globalIdx >= endIdx) return;
        const visibleIdx = globalIdx - startIdx;

        const x = getX(visibleIdx);
        const candle = priceData[globalIdx];
        const isBuy = sig.signal.includes('buy');

        if (isBuy) {
          const y = getY(candle.low) + 10;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#26a69a';
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = `600 8px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('B', x, y + 3);
        } else {
          const y = getY(candle.high) - 10;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#ef5350';
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = `600 8px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('S', x, y + 3);
        }
      });
    }

    ctx.restore(); // End chart clip region - price labels and lines below should not be clipped

    // Mobile-friendly price formatter
    const formatPriceCompact = (price) => {
      if (isSmallScreen) {
        if (price >= 10000) return Math.round(price).toLocaleString();
        if (price >= 1000) return price.toFixed(0);
        if (price >= 100) return price.toFixed(1);
        if (price >= 1) return price.toFixed(2);
        return price.toFixed(4);
      }
      return formatPrice(price);
    };

    // Draw grid price labels (outside clip region so they're visible)
    ctx.fillStyle = '#787b86';
    ctx.font = `400 ${isSmallScreen ? 8 : fontSize}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
    ctx.textAlign = 'left';
    for (let i = 0; i <= gridLevels; i++) {
      const y = padding.top + (i / gridLevels) * (mainChartHeight - 15);
      const price = maxPrice - (i / gridLevels) * priceRange;
      ctx.fillText(formatPriceCompact(price), width - padding.right + 2, y + 4);
    }

    // Current price line
    const currentPrice = livePrice || priceData[priceData.length - 1].close;
    const currentY = getY(currentPrice);
    const isUp = currentPrice >= (priceData[0]?.open || currentPrice);

    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = isUp ? '#26a69a' : '#ef5350';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, currentY);
    ctx.lineTo(width - padding.right, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Current price tag - responsive width
    const tagColor = isUp ? '#26a69a' : '#ef5350';
    const priceText = formatPriceCompact(currentPrice);
    const tagWidth = isSmallScreen ? 38 : 70;

    ctx.fillStyle = tagColor;
    ctx.fillRect(width - padding.right, currentY - 7, tagWidth, 14);
    ctx.fillStyle = '#fff';
    ctx.font = `600 ${isSmallScreen ? 8 : fontSizeSmall}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(priceText, width - padding.right + 2, currentY + 3);

    // Countdown timer - responsive
    if (candleCountdown) {
      ctx.fillStyle = '#1e222d';
      ctx.fillRect(width - padding.right, currentY + 8, tagWidth, 11);
      ctx.fillStyle = '#787b86';
      ctx.font = `400 ${isSmallScreen ? 7 : fontSizeSmall - 1}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
      ctx.fillText(candleCountdown, width - padding.right + 2, currentY + 16);
    }

    // Draw volume section with clear separator
    if (indicators.volume) {
      const volumeTop = padding.top + mainChartHeight + 2;
      const volumes = priceData.map(d => d.volume || 0);
      const maxVol = Math.max(...volumes);

      // Draw section separator line
      ctx.strokeStyle = '#2a2e39';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, volumeTop - 1);
      ctx.lineTo(width, volumeTop - 1);
      ctx.stroke();

      // Clip volume bars to its own section only
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, volumeTop, clipBoundary, volumeHeight);
      ctx.clip();

      drawableData.forEach((d, i) => {
        const x = getX(i);
        const volH = maxVol > 0 ? (d.volume / maxVol) * (volumeHeight - 6) : 0;
        const y = volumeTop + volumeHeight - volH - 2;
        const isGreen = d.close >= d.open;

        ctx.fillStyle = isGreen ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)';
        ctx.fillRect(x - bodyWidth / 2, y, bodyWidth, volH);
      });

      ctx.restore(); // Remove volume clip

      ctx.fillStyle = '#787b86';
      ctx.font = `400 ${fontSizeSmall - 1}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText('VOL', padding.left + 2, volumeTop + 10);
    }

    // Draw Sniper Oscillator section with clear separator
    if (indicators.sniperOsc && marketData.sniperOscillator) {
      const { k: kLine } = marketData.sniperOscillator;
      const oscTop = padding.top + mainChartHeight + volumeHeight + 4;
      const oscPaddingTop = 18;
      const oscPaddingBottom = 22;
      const oscHeight = sniperOscHeight - 25 - oscPaddingTop - oscPaddingBottom;

      // Draw section separator line
      ctx.strokeStyle = '#2a2e39';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, oscTop - 2);
      ctx.lineTo(width, oscTop - 2);
      ctx.stroke();

      if (kLine && kLine.length > 0) {
        const getOscY = (value) => {
          const clampedValue = Math.max(0, Math.min(100, value));
          return oscTop + oscPaddingTop + ((100 - clampedValue) / 100) * oscHeight;
        };

        const oscGap = oscCandleWidth;
        // Same positioning as main chart
        const getOscX = (oscVisibleIdx) => padding.left + oscVisibleIdx * oscGap + oscGap / 2;

        // Clip oscillator to its own section only
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, oscTop, clipBoundary, sniperOscHeight);
        ctx.clip();

        // Draw level lines (now clipped)
        const y80 = getOscY(80);
        ctx.strokeStyle = 'rgba(239, 83, 80, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(padding.left, y80);
        ctx.lineTo(width - padding.right, y80);
        ctx.stroke();

        const y50 = getOscY(50);
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
        ctx.beginPath();
        ctx.moveTo(padding.left, y50);
        ctx.lineTo(width - padding.right, y50);
        ctx.stroke();

        const y20 = getOscY(20);
        ctx.strokeStyle = 'rgba(38, 166, 154, 0.2)';
        ctx.beginPath();
        ctx.moveTo(padding.left, y20);
        ctx.lineTo(width - padding.right, y20);
        ctx.stroke();

        ctx.setLineDash([]);

        // Draw filled area
        const baseYFill = getOscY(5);
        // Adjust for skipped candles to match main chart
        const adjustedOscStartIdx = oscStartIdx + candlesToSkip;
        kLine.forEach((k) => {
          const globalIdx = priceData.findIndex(p => p.date === k.date);
          if (globalIdx < adjustedOscStartIdx || globalIdx >= oscEndIdx) return;
          const visibleIdx = globalIdx - adjustedOscStartIdx;

          const x = getOscX(visibleIdx);
          const value = k.value;
          const y = getOscY(value);
          const colWidth = Math.max(1.5, oscGap * 0.85);

          const gradient = ctx.createLinearGradient(0, baseYFill, 0, y);

          if (value >= 80) {
            gradient.addColorStop(0, 'rgba(183, 28, 28, 0.1)');
            gradient.addColorStop(1, 'rgba(239, 83, 80, 0.4)');
          } else if (value >= 60) {
            gradient.addColorStop(0, 'rgba(230, 81, 0, 0.08)');
            gradient.addColorStop(1, 'rgba(255, 152, 0, 0.35)');
          } else if (value >= 40) {
            gradient.addColorStop(0, 'rgba(130, 119, 23, 0.08)');
            gradient.addColorStop(1, 'rgba(255, 202, 40, 0.3)');
          } else if (value >= 20) {
            gradient.addColorStop(0, 'rgba(27, 94, 32, 0.1)');
            gradient.addColorStop(1, 'rgba(102, 187, 106, 0.3)');
          } else {
            gradient.addColorStop(0, 'rgba(13, 71, 161, 0.12)');
            gradient.addColorStop(1, 'rgba(38, 166, 154, 0.35)');
          }

          ctx.fillStyle = gradient;
          ctx.fillRect(x - colWidth / 2, y, colWidth, baseYFill - y);
        });

        // Calculate MA lines
        let ma1Line = [];
        let ingMid = [];
        let ingSlow = [];
        let ema200Line = [];

        const ema200Mult = 2 / (200 + 1);
        let ema200Prev = kLine[0]?.value || 50;

        for (let i = 0; i < kLine.length; i++) {
          const start5 = Math.max(0, i - 4);
          const slice5 = kLine.slice(start5, i + 1);
          const avg5 = slice5.reduce((a, b) => a + b.value, 0) / slice5.length;
          ma1Line.push({ date: kLine[i].date, value: avg5 });

          const start7 = Math.max(0, i - 6);
          const slice7 = kLine.slice(start7, i + 1);
          const avg7 = slice7.reduce((a, b) => a + b.value, 0) / slice7.length;
          ingMid.push({ date: kLine[i].date, value: avg7 });

          const start13 = Math.max(0, i - 12);
          const slice13 = kLine.slice(start13, i + 1);
          const avg13 = slice13.reduce((a, b) => a + b.value, 0) / slice13.length;
          ingSlow.push({ date: kLine[i].date, value: avg13 });

          const currentVal = kLine[i].value;
          const ema200Val = (currentVal - ema200Prev) * ema200Mult + ema200Prev;
          ema200Line.push({ date: kLine[i].date, value: ema200Val });
          ema200Prev = ema200Val;
        }

        // Draw oscillator lines
        // Smooth oscillator line drawing with bezier curves
        const drawOscLine = (data, color, lw = 1) => {
          const points = [];
          data.forEach((m) => {
            const globalIdx = priceData.findIndex(p => p.date === m.date);
            if (globalIdx < adjustedOscStartIdx || globalIdx >= oscEndIdx) return;
            const visibleIdx = globalIdx - adjustedOscStartIdx;
            const x = getOscX(visibleIdx);
            const y = getOscY(m.value);
            points.push({ x, y });
          });

          if (points.length < 2) return;

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = lw;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';

          ctx.moveTo(points[0].x, points[0].y);

          if (points.length > 2) {
            // Use quadratic bezier curves for smooth lines
            for (let i = 1; i < points.length - 1; i++) {
              const xc = (points[i].x + points[i + 1].x) / 2;
              const yc = (points[i].y + points[i + 1].y) / 2;
              ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            const last = points[points.length - 1];
            ctx.lineTo(last.x, last.y);
          } else {
            ctx.lineTo(points[1].x, points[1].y);
          }

          ctx.stroke();
        };

        drawOscLine(ma1Line, '#2962ff', 1);
        drawOscLine(ingSlow, '#66bb6a', 1);
        drawOscLine(ingMid, '#ef5350', 1);
        drawOscLine(ema200Line, '#ffffff', 1.5);

        ctx.restore(); // Remove oscillator clip

        // Level labels - adjusted for mobile
        const labelFontSize = isSmallScreen ? 8 : fontSizeSmall - 1;
        [20, 50, 80].forEach(level => {
          const y = getOscY(level);
          ctx.fillStyle = level === 50 ? '#787b86' : level === 80 ? 'rgba(239, 83, 80, 0.8)' : 'rgba(38, 166, 154, 0.8)';
          ctx.font = `400 ${labelFontSize}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
          ctx.textAlign = 'left';
          ctx.fillText(level.toString(), width - padding.right + 2, y + 3);
        });

        // Current value badge - smaller on mobile
        const lastK = kLine[kLine.length - 1];
        if (lastK && typeof lastK.value === 'number') {
          const kVal = lastK.value;
          const y = getOscY(kVal);
          const badgeColor = kVal >= 80 ? '#ef5350' : kVal <= 20 ? '#26a69a' : '#ff9800';

          const valueText = isSmallScreen ? kVal.toFixed(0) : kVal.toFixed(1);
          const badgeWidth = isSmallScreen ? 24 : 30;
          ctx.fillStyle = badgeColor;
          ctx.beginPath();
          ctx.roundRect(width - padding.right + 1, y - 6, badgeWidth, 12, 3);
          ctx.fill();

          ctx.fillStyle = '#fff';
          ctx.font = `600 ${isSmallScreen ? 8 : fontSizeSmall - 1}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(valueText, width - padding.right + 1 + badgeWidth / 2, y + 3);
        }

        // Indicator title
        ctx.fillStyle = '#787b86';
        ctx.font = `500 ${isSmallScreen ? 9 : fontSizeSmall}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText('SNIPER', padding.left + 3, oscTop + 12);

        // Current values - compact on mobile
        const lastEMA200 = ema200Line[ema200Line.length - 1]?.value?.toFixed(isSmallScreen ? 0 : 1) || '--';
        const lastRed = ingMid[ingMid.length - 1]?.value?.toFixed(isSmallScreen ? 0 : 1) || '--';
        const lastGreen = ingSlow[ingSlow.length - 1]?.value?.toFixed(isSmallScreen ? 0 : 1) || '--';
        const lastBlue = ma1Line[ma1Line.length - 1]?.value?.toFixed(isSmallScreen ? 0 : 1) || '--';

        const valueSpacing = isSmallScreen ? 22 : 32;
        let xPos = padding.left + (isSmallScreen ? 42 : 50);
        const valY = oscTop + 12;
        ctx.font = `400 ${isSmallScreen ? 8 : fontSizeSmall - 1}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;

        ctx.fillStyle = '#ffffff';
        ctx.fillText(lastEMA200, xPos, valY);
        xPos += valueSpacing;

        ctx.fillStyle = '#ef5350';
        ctx.fillText(lastRed, xPos, valY);
        xPos += valueSpacing;

        ctx.fillStyle = '#66bb6a';
        ctx.fillText(lastGreen, xPos, valY);
        xPos += valueSpacing;

        ctx.fillStyle = '#2962ff';
        ctx.fillText(lastBlue, xPos, valY);
      }
    }

    // Crosshair and tooltip
    const crosshair = crosshairRef.current;
    if (crosshair.visible && crosshair.x !== null && crosshair.y !== null) {
      const cursorX = crosshair.x;
      const cursorY = crosshair.y;

      if (cursorX >= padding.left && cursorX <= width - padding.right && cursorY >= padding.top && cursorY <= totalChartBottom) {
        const candleIndex = Math.floor((cursorX - padding.left) / gap);
        const hoveredCandle = visibleData[candleIndex];

        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cursorX, padding.top);
        ctx.lineTo(cursorX, totalChartBottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padding.left, cursorY);
        ctx.lineTo(width - padding.right, cursorY);
        ctx.stroke();
        ctx.restore();

        let cursorPrice = null;
        if (cursorY >= mainChartTop && cursorY <= mainChartTop + mainChartHeight - 15) {
          cursorPrice = maxPrice - ((cursorY - mainChartTop) / (mainChartHeight - 15)) * priceRange;
        }

        if (cursorPrice !== null) {
          const priceText = formatPrice(cursorPrice);
          const priceLabelWidth = ctx.measureText(priceText).width + 10;
          ctx.fillStyle = '#363a45';
          ctx.fillRect(width - padding.right + 2, cursorY - 9, priceLabelWidth + 4, 18);
          ctx.strokeStyle = '#4a4e59';
          ctx.lineWidth = 1;
          ctx.strokeRect(width - padding.right + 2, cursorY - 9, priceLabelWidth + 4, 18);
          ctx.fillStyle = '#d1d4dc';
          ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
          ctx.textAlign = 'left';
          ctx.fillText(priceText, width - padding.right + 6, cursorY + 4);
        }

        if (hoveredCandle && candleIndex >= 0 && candleIndex < visibleData.length) {
          const tooltipPadding = isFullscreenMode ? 14 : 12;
          const lineHeight = isFullscreenMode ? 20 : 18;
          const tooltipWidth = isSmallScreen ? 130 : (isFullscreenMode ? 170 : 150);
          const tooltipHeight = isFullscreenMode ? 100 : 90;

          const candleDate = new Date(hoveredCandle.timestamp);
          const dateStr = candleDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
          const timeStr = candleDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

          let tooltipX = cursorX + 15;
          let tooltipY = cursorY - tooltipHeight / 2;

          if (tooltipX + tooltipWidth > width - padding.right) {
            tooltipX = cursorX - tooltipWidth - 15;
          }
          if (tooltipY < padding.top) {
            tooltipY = padding.top;
          }
          if (tooltipY + tooltipHeight > totalChartBottom) {
            tooltipY = totalChartBottom - tooltipHeight;
          }

          ctx.fillStyle = 'rgba(30, 34, 45, 0.97)';
          ctx.beginPath();
          ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 6);
          ctx.fill();
          ctx.strokeStyle = '#363a45';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.textAlign = 'left';
          let yOffset = tooltipY + tooltipPadding + 4;

          const isGreen = hoveredCandle.close >= hoveredCandle.open;
          ctx.fillStyle = isGreen ? '#26a69a' : '#ef5350';
          ctx.font = `600 ${isSmallScreen ? 16 : (isFullscreenMode ? 20 : 18)}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
          ctx.fillText(formatPrice(hoveredCandle.close), tooltipX + tooltipPadding, yOffset);
          yOffset += lineHeight + 4;

          ctx.fillStyle = '#787b86';
          ctx.font = `400 ${isSmallScreen ? 10 : (isFullscreenMode ? 12 : 11)}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
          ctx.fillText(`${dateStr}`, tooltipX + tooltipPadding, yOffset);
          yOffset += lineHeight - 4;
          ctx.fillText(`${timeStr} UTC`, tooltipX + tooltipPadding, yOffset);
          yOffset += lineHeight;

          ctx.font = `400 ${isSmallScreen ? 9 : (isFullscreenMode ? 11 : 10)}px -apple-system, BlinkMacSystemFont, Trebuchet MS, sans-serif`;
          ctx.fillStyle = '#787b86';
          const ohlcText = `O:${formatPrice(hoveredCandle.open)} H:${formatPrice(hoveredCandle.high)}`;
          ctx.fillText(ohlcText, tooltipX + tooltipPadding, yOffset);
        }
      }
    }
  };

  const formatPrice = (price) => {
    if (!price) return '--';
    if (price >= 10000) return price.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    if (price >= 100) return price.toFixed(2);
    if (price >= 1) return price.toFixed(2);
    return price.toFixed(4);
  };

  const getSignalInfo = (signal) => {
    switch (signal) {
      case 'strong_buy': return { text: 'STRONG BUY', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: TrendingUp };
      case 'buy': return { text: 'BUY', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: TrendingUp };
      case 'strong_sell': return { text: 'STRONG SELL', color: 'text-red-400', bg: 'bg-red-500/20', icon: TrendingDown };
      case 'sell': return { text: 'SELL', color: 'text-red-400', bg: 'bg-red-500/20', icon: TrendingDown };
      default: return { text: 'HOLD', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Activity };
    }
  };

  // Reset viewport
  const resetViewport = useCallback(() => {
    if (!marketData?.priceData) return;
    const candleCount = marketData.priceData.length;
    const defaultViewport = {
      startIndex: 0,
      endIndex: candleCount,
      candleWidth: 8,
      minCandleWidth: 2,
      maxCandleWidth: 25,
    };
    chartViewportRef.current = { ...defaultViewport };
    oscViewportRef.current = { ...defaultViewport };
    setRenderTrigger(prev => prev + 1);
    scheduleRender();
  }, [marketData, scheduleRender]);

  const currentAsset = getCurrentAsset();
  const signalInfo = marketData?.currentSignal ? getSignalInfo(marketData.currentSignal.signal) : getSignalInfo('hold');
  const SignalIcon = signalInfo.icon;

  const isCrypto = selectedCategory === 'crypto';
  const shownPrice = isCrypto ? (displayPrice || livePrice || marketData?.currentPrice) : (livePrice || marketData?.currentPrice);
  const priceChange = shownPrice && marketData?.previousClose ? shownPrice - marketData.previousClose : 0;
  const priceChangePercent = marketData?.previousClose ? ((priceChange / marketData.previousClose) * 100) : 0;

  const toggleIndicator = (key) => {
    setIndicators(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isZoomed = () => {
    return chartViewportRef.current.candleWidth !== 8 || oscViewportRef.current.candleWidth !== 8;
  };

  // Get all assets for search
  const allAssets = Object.entries(ASSET_CATEGORIES).flatMap(([catKey, cat]) =>
    cat.assets.map((asset) => ({ ...asset, category: catKey, categoryName: cat.name }))
  );

  const filteredAssets = assetSearch
    ? allAssets.filter(
        (a) =>
          a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
          a.short.toLowerCase().includes(assetSearch.toLowerCase())
      )
    : allAssets;

  // The main chart content
  const chartContent = (
    <div
      ref={fullscreenContainerRef}
      className={fullscreen ? (isIOSFullscreen ? 'ios-fullscreen-container' : '') : 'bg-[#131722] rounded-lg border border-[#363a45]'}
      style={fullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: isIOSFullscreen && iosViewportHeight > 0 ? `${iosViewportHeight}px` : '100vh',
        zIndex: 999999,
        background: '#131722',
        overflow: 'hidden',
      } : {}}
    >

      {/* Header - Always show */}
      <div
        className="flex items-center justify-between h-[44px] sm:h-[38px] px-1 bg-[#1e222d] border-b border-[#363a45]"
        style={fullscreen ? { marginTop: '10px' } : {}}
      >
        {/* Left Section: Symbol + Timeframe */}
        <div className="flex items-center gap-1">
          {/* Symbol Selector */}
          <div className="relative">
            <button
              onClick={() => setShowAssetSearch(!showAssetSearch)}
              className="flex items-center gap-1 h-[44px] sm:h-[38px] px-2 sm:px-2 hover:bg-[#2a2e39] active:bg-[#363a45] transition-colors"
            >
              <span className="text-[#d1d4dc] font-normal text-[14px] sm:text-[13px]">{currentAsset?.short || 'BTC'}</span>
              <ChevronDown className="h-3.5 w-3.5 sm:h-3 sm:w-3 text-[#787b86]" />
            </button>

            {/* Asset Dropdown - Simple list on mobile, with search on desktop */}
            {showAssetSearch && (
              <div className={`bg-[#1e222d] border border-[#363a45] rounded-lg shadow-2xl ${
                isMobile
                  ? 'fixed left-3 right-3 top-[100px] z-[9999999]'
                  : `absolute top-full left-0 mt-0.5 w-[280px] z-[9999]`
              }`}>
                {/* Search box - only on desktop */}
                {!isMobile && (
                  <div className="p-2 border-b border-[#363a45]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#787b86]" />
                      <input
                        type="text"
                        placeholder="Search assets..."
                        value={assetSearch}
                        onChange={(e) => setAssetSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-[#131722] border border-[#363a45] rounded-lg text-[#d1d4dc] text-xs placeholder-[#787b86] focus:outline-none focus:border-[#2962ff]"
                        autoFocus
                      />
                    </div>
                  </div>
                )}
                <div className={`overflow-y-auto ${isMobile ? 'max-h-[50vh]' : 'max-h-[240px]'}`}>
                  {(isMobile ? allAssets : filteredAssets).map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => {
                        setSelectedCategory(asset.category);
                        setSelectedAsset(asset.symbol);
                        setShowAssetSearch(false);
                        setAssetSearch('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 sm:py-2 text-left hover:bg-[#2a2e39] active:bg-[#363a45] ${
                        selectedAsset === asset.symbol ? 'bg-[#2962ff]/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:gap-2">
                        <span className="text-lg sm:text-sm">{ASSET_CATEGORIES[asset.category].icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#d1d4dc] text-sm sm:text-xs font-medium">{asset.short}{asset.category === 'crypto' ? 'USDT' : ''}</span>
                            {!isMarketOpenForCategory(asset.category) && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">CLOSED</span>
                            )}
                            {isMarketOpenForCategory(asset.category) && asset.category !== 'crypto' && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">LIVE</span>
                            )}
                          </div>
                          <div className="text-[#787b86] text-xs sm:text-[10px]">{asset.name}</div>
                        </div>
                      </div>
                      {selectedAsset === asset.symbol && <Check className="h-4 w-4 sm:h-3 sm:w-3 text-[#2962ff]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile: Timeframe Button */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setShowMobileTimeframes(!showMobileTimeframes)}
              className="flex items-center gap-1 h-[44px] px-2 hover:bg-[#2a2e39] active:bg-[#363a45]"
            >
              <span className="text-[#2962ff] font-normal text-[14px]">{timeframe.toUpperCase()}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#787b86]" />
            </button>

            {/* Mobile Timeframe Dropdown */}
            {showMobileTimeframes && (
              <div className={`fixed left-3 top-[60px] w-[140px] bg-[#1e222d] border border-[#363a45] rounded-lg shadow-2xl ${fullscreen ? 'z-[9999999]' : 'z-[9999]'}`}>
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => {
                      setTimeframe(tf.value);
                      setShowMobileTimeframes(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 text-left ${
                      timeframe === tf.value ? 'bg-[#2962ff]/10 text-[#2962ff]' : 'text-[#d1d4dc] hover:bg-[#2a2e39]'
                    }`}
                  >
                    <span className="text-sm font-medium">{tf.label}</span>
                    {timeframe === tf.value && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Timeframes inline */}
          <div className="hidden sm:flex items-center">
            <div className="w-px h-5 bg-[#363a45] mx-1"></div>
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`h-[38px] px-2 text-[11px] font-medium transition-colors ${
                  timeframe === tf.value
                    ? 'text-[#d1d4dc] bg-[#2a2e39]'
                    : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Chart Type - Hidden on mobile, shown in controls */}
          <div className="hidden sm:flex items-center">
            <div className="w-px h-5 bg-[#363a45] mx-1"></div>
            <button
              onClick={() => setChartType('candle')}
              className={`h-[38px] px-2 transition-colors ${chartType === 'candle' ? 'text-[#d1d4dc]' : 'text-[#787b86] hover:text-[#d1d4dc]'}`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`h-[38px] px-2 transition-colors ${chartType === 'line' ? 'text-[#d1d4dc]' : 'text-[#787b86] hover:text-[#d1d4dc]'}`}
            >
              <LineChart className="h-4 w-4" />
            </button>
          </div>

          {/* Indicators Button */}
          <div className="hidden sm:flex items-center">
            <div className="w-px h-5 bg-[#363a45] mx-1"></div>
            <button
              onClick={() => setShowIndicatorMenu(!showIndicatorMenu)}
              className={`h-[38px] px-2 transition-colors flex items-center gap-1.5 ${
                showIndicatorMenu ? 'text-[#2962ff] bg-[#2962ff]/10' : 'text-[#787b86] hover:text-[#d1d4dc]'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span className="text-[11px]">Indicators</span>
              <span className="text-[9px] bg-[#2962ff] text-white px-1.5 py-0.5 rounded-full font-medium">
                {Object.values(indicators).filter(v => v).length}
              </span>
            </button>
          </div>
        </div>

        {/* Right Section: Price + Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Price - More prominent on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2">
            <span className={`font-mono text-[15px] sm:text-[13px] font-normal ${priceDirection === 'up' ? 'text-[#26a69a]' : priceDirection === 'down' ? 'text-[#ef5350]' : 'text-[#d1d4dc]'}`}>
              {formatPrice(shownPrice)}
            </span>
            <span className={`text-[11px] sm:text-[11px] font-medium ${priceChange >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </span>
          </div>

          {/* Connection indicator */}
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCrypto ? (isConnected ? 'bg-[#26a69a]' : 'bg-[#ef5350]') : (isMarketOpen ? 'bg-[#26a69a]' : 'bg-[#787b86]')}`}></div>

          {/* Controls - Larger touch targets on mobile */}
          {isZoomed() && (
            <button
              onClick={resetViewport}
              className="h-[44px] sm:h-[38px] w-[44px] sm:w-auto sm:px-2 text-[#787b86] hover:text-[#d1d4dc] active:bg-[#2a2e39] flex items-center justify-center gap-1 transition-colors rounded"
              title="Reset zoom & pan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>
          )}
          <button
            onClick={fetchHistoricalData}
            disabled={loading}
            className="h-[44px] sm:h-[38px] w-[44px] sm:w-auto sm:px-2 text-[#787b86] hover:text-[#d1d4dc] active:bg-[#2a2e39] flex items-center justify-center transition-colors rounded"
            title="Refresh data"
          >
            <RefreshCw className={`h-5 w-5 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="h-[44px] sm:h-[38px] w-[44px] sm:w-auto sm:px-2 text-[#787b86] hover:text-[#d1d4dc] active:bg-[#2a2e39] flex items-center justify-center transition-colors rounded"
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize2 className="h-5 w-5 sm:h-4 sm:w-4" /> : <Maximize2 className="h-5 w-5 sm:h-4 sm:w-4" />}
          </button>
        </div>
      </div>

      {/* Indicator Settings Menu - Mobile Optimized */}
      {showIndicatorMenu && (
        <div
          className={`${
            isMobile
              ? 'fixed inset-x-2 top-[90px] w-auto max-h-[70vh]'
              : 'absolute top-[42px] left-2 sm:left-auto w-[260px]'
          } bg-[#1e222d] border border-[#363a45] rounded-lg shadow-2xl ${fullscreen ? 'z-[9999999]' : 'z-50'} overflow-hidden`}
          style={{
            animation: 'fadeInScale 0.15s ease-out',
          }}
        >
          <style jsx>{`
            @keyframes fadeInScale {
              from { opacity: 0; transform: scale(0.95) translateY(-5px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div className="px-3 py-2 border-b border-[#363a45] flex items-center justify-between">
            <span className="text-[#d1d4dc] text-xs font-medium">Indicators</span>
            <button
              onClick={() => {
                const allOn = Object.values(indicators).every(v => v);
                setIndicators(prev => {
                  const newState = {};
                  Object.keys(prev).forEach(key => {
                    newState[key] = !allOn;
                  });
                  return newState;
                });
              }}
              className="text-[10px] text-[#2962ff] hover:text-[#5b8def] transition-colors"
            >
              {Object.values(indicators).every(v => v) ? 'Hide All' : 'Show All'}
            </button>
          </div>

          {/* Overlay Indicators Section */}
          <div className="p-2">
            <div className="text-[10px] text-[#787b86] uppercase tracking-wider mb-1.5 px-1">Overlays</div>
            <div className="space-y-0.5">
              {[
                { key: 'emaFast', label: 'EMA 9 (Fast)', color: '#00bcd4', desc: 'Short-term trend' },
                { key: 'emaMid', label: 'EMA 21 (Mid)', color: '#ffca28', desc: 'Medium-term trend' },
                { key: 'emaSlow', label: 'EMA 50 (Slow)', color: '#e91e63', desc: 'Long-term trend' },
                { key: 'adaptiveTrend', label: 'Adaptive Trend', color: '#10b981', desc: 'ATR-based trend cloud' },
                { key: 'fibRetracement', label: 'Fibonacci Levels', color: '#9c27b0', desc: 'Auto fib retracement' },
                { key: 'signals', label: 'Buy/Sell Signals', color: '#26a69a', desc: 'Entry/exit markers' },
              ].map(({ key, label, color, desc }) => (
                <button
                  key={key}
                  onClick={() => toggleIndicator(key)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-left transition-all duration-150 ${
                    indicators[key] ? 'bg-[#2962ff]/10 hover:bg-[#2962ff]/15' : 'hover:bg-[#2a2e39]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-all duration-150 ${
                      indicators[key]
                        ? 'bg-[#2962ff] shadow-[0_0_8px_rgba(41,98,255,0.4)]'
                        : 'border border-[#787b86]/50 bg-transparent'
                    }`}
                  >
                    {indicators[key] && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </div>
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: color, boxShadow: indicators[key] ? `0 0 6px ${color}50` : 'none' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium truncate ${indicators[key] ? 'text-[#d1d4dc]' : 'text-[#787b86]'}`}>
                      {label}
                    </div>
                    <div className="text-[10px] text-[#787b86]/70 truncate">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-[#363a45] mx-2" />

          {/* Panel Indicators Section */}
          <div className="p-2">
            <div className="text-[10px] text-[#787b86] uppercase tracking-wider mb-1.5 px-1">Panels</div>
            <div className="space-y-0.5">
              {[
                { key: 'volume', label: 'Volume', color: '#787b86', desc: 'Trading volume bars' },
                { key: 'sniperOsc', label: 'Sniper Oscillator', color: '#2962ff', desc: 'Custom momentum indicator' },
              ].map(({ key, label, color, desc }) => (
                <button
                  key={key}
                  onClick={() => toggleIndicator(key)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-left transition-all duration-150 ${
                    indicators[key] ? 'bg-[#2962ff]/10 hover:bg-[#2962ff]/15' : 'hover:bg-[#2a2e39]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-all duration-150 ${
                      indicators[key]
                        ? 'bg-[#2962ff] shadow-[0_0_8px_rgba(41,98,255,0.4)]'
                        : 'border border-[#787b86]/50 bg-transparent'
                    }`}
                  >
                    {indicators[key] && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </div>
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: color, boxShadow: indicators[key] ? `0 0 6px ${color}50` : 'none' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium truncate ${indicators[key] ? 'text-[#d1d4dc]' : 'text-[#787b86]'}`}>
                      {label}
                    </div>
                    <div className="text-[10px] text-[#787b86]/70 truncate">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Count Footer */}
          <div className="px-3 py-2 border-t border-[#363a45] bg-[#131722]/50">
            <div className="text-[10px] text-[#787b86]">
              {Object.values(indicators).filter(v => v).length} of {Object.keys(indicators).length} active
            </div>
          </div>
        </div>
      )}

      {/* Mobile Quick Actions Bar - Hidden in mobile fullscreen */}
      {isMobile && !fullscreen && (
        <div className="flex items-center justify-between h-[40px] px-2 bg-[#1e222d] border-b border-[#363a45]">
          {/* Chart Type Toggle */}
          <div className="flex items-center gap-1 bg-[#131722] rounded-lg p-0.5">
            <button
              onClick={() => setChartType('candle')}
              className={`p-2 rounded-md transition-colors ${chartType === 'candle' ? 'bg-[#2962ff] text-white' : 'text-[#787b86]'}`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-colors ${chartType === 'line' ? 'bg-[#2962ff] text-white' : 'text-[#787b86]'}`}
            >
              <LineChart className="h-4 w-4" />
            </button>
          </div>

          {/* Indicators Toggle */}
          <button
            onClick={() => setShowIndicatorMenu(!showIndicatorMenu)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
              showIndicatorMenu ? 'bg-[#2962ff] text-white' : 'bg-[#131722] text-[#787b86]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span className="text-xs font-medium">Indicators</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
              {Object.values(indicators).filter(v => v).length}
            </span>
          </button>

          {/* Signal Badge */}
          <div className={`flex items-center gap-1 px-2 py-1.5 rounded-lg ${signalInfo.bg}`}>
            <SignalIcon className={`h-3.5 w-3.5 ${signalInfo.color}`} />
            <span className={`text-xs font-normal ${signalInfo.color}`}>{signalInfo.text}</span>
          </div>
        </div>
      )}

      {/* Chart Area */}
      <div
        ref={containerRef}
        className="relative"
        style={fullscreen ? {
          position: 'relative',
          width: '100%',
          height: 'calc(100% - 54px)',
        } : {}}
      >
        {loading && !marketData ? (
          <div className="bg-[#131722] flex items-center justify-center h-[380px] sm:h-[480px] md:h-[520px]" style={fullscreen ? { height: '100%' } : {}}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[#2962ff] border-t-transparent rounded-full animate-spin" />
              <span className="text-[#787b86] text-sm">Loading chart...</span>
            </div>
          </div>
        ) : error && !marketData ? (
          <div className="bg-[#131722] flex items-center justify-center h-[380px] sm:h-[480px] md:h-[520px]" style={fullscreen ? { height: '100%' } : {}}>
            <div className="text-center px-4">
              <AlertCircle className="h-10 w-10 text-[#ef5350] mx-auto mb-3" />
              <p className="text-[#787b86] text-sm mb-3">{error}</p>
              <button
                onClick={fetchHistoricalData}
                className="px-4 py-2 bg-[#2962ff] text-white text-sm font-medium rounded-lg hover:bg-[#3d72ff] active:scale-95 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="relative" style={fullscreen ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } : {}}>
            <canvas
              ref={chartRef}
              className={fullscreen ? '' : 'w-full h-[380px] sm:h-[480px] md:h-[520px]'}
              style={fullscreen ? {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#131722',
                touchAction: 'none',
              } : {
                background: '#131722',
                cursor: isMobile ? 'default' : 'crosshair',
                touchAction: 'none',
                display: 'block',
              }}
            />

            {/* Draggable Divider between Chart and Oscillator */}
            {indicators.sniperOsc && (
              <div
                className="absolute left-0 right-0 h-6 flex items-center justify-center cursor-ns-resize z-20 group"
                style={{
                  // Position based on chartOscRatio - account for header area (~8%) and time axis
                  // Approximate: top offset = ratio of chart area relative to total canvas height
                  top: `calc(${(chartOscRatio * (indicators.volume ? 0.92 : 1) + (indicators.volume ? 0.08 : 0)) * 90 + 5}%)`,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleDividerStart(e.clientY);
                }}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    e.preventDefault();
                    handleDividerStart(e.touches[0].clientY);
                  }
                }}
              >
                {/* Divider line */}
                <div className="absolute inset-x-0 top-1/2 h-[2px] bg-[#2a2e39] group-hover:bg-[#2962ff] group-active:bg-[#2962ff] transition-colors" />

                {/* Drag handle */}
                <div className="relative bg-[#1e222d] border border-[#363a45] group-hover:border-[#2962ff] group-active:border-[#2962ff] rounded-full px-3 py-1 flex items-center gap-1 transition-colors shadow-lg">
                  <div className="flex flex-col gap-0.5">
                    <div className="w-4 h-[2px] bg-[#787b86] rounded group-hover:bg-[#2962ff] group-active:bg-[#2962ff] transition-colors" />
                    <div className="w-4 h-[2px] bg-[#787b86] rounded group-hover:bg-[#2962ff] group-active:bg-[#2962ff] transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {/* Zoom Controls - Floating buttons */}
            <div className="absolute bottom-3 right-2 flex flex-col gap-1.5 z-10">
              {/* Zoom In - positive deltaY = bigger candles */}
              <button
                onClick={() => {
                  const canvas = chartRef.current;
                  if (!canvas) return;
                  const rect = canvas.getBoundingClientRect();
                  handleZoom(100, rect.width / 2, rect.height / 2);
                }}
                className="w-9 h-9 bg-[#1e222d]/90 hover:bg-[#2a2e39] border border-[#363a45] rounded-lg flex items-center justify-center text-[#d1d4dc] active:scale-95 transition-all shadow-lg"
                title="Zoom In"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </button>

              {/* Zoom Out - negative deltaY = smaller candles */}
              <button
                onClick={() => {
                  const canvas = chartRef.current;
                  if (!canvas) return;
                  const rect = canvas.getBoundingClientRect();
                  handleZoom(-100, rect.width / 2, rect.height / 2);
                }}
                className="w-9 h-9 bg-[#1e222d]/90 hover:bg-[#2a2e39] border border-[#363a45] rounded-lg flex items-center justify-center text-[#d1d4dc] active:scale-95 transition-all shadow-lg"
                title="Zoom Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </button>

              {/* Reset Zoom */}
              {isZoomed() && (
                <button
                  onClick={resetViewport}
                  className="w-9 h-9 bg-[#2962ff]/90 hover:bg-[#2962ff] border border-[#2962ff] rounded-lg flex items-center justify-center text-white active:scale-95 transition-all shadow-lg"
                  title="Reset Zoom"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </svg>
                </button>
              )}

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="w-9 h-9 bg-[#1e222d]/90 hover:bg-[#2a2e39] border border-[#363a45] rounded-lg flex items-center justify-center text-[#d1d4dc] active:scale-95 transition-all shadow-lg"
                title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {fullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </button>

              {/* Scroll Down Button - Mobile only */}
              {!fullscreen && isMobile && (
                <button
                  onClick={() => {
                    window.scrollBy({ top: 300, behavior: 'smooth' });
                  }}
                  className="w-9 h-9 bg-[#1e222d]/90 hover:bg-[#2a2e39] border border-[#363a45] rounded-lg flex items-center justify-center text-[#d1d4dc] active:scale-95 transition-all shadow-lg"
                  title="Scroll Down"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Sniper Oscillator Panel - TradingView Style */}
      {indicators.sniperOsc && (
        <div className="border-t border-[#363a45]">
          <div className="h-[28px] px-2 bg-[#1e222d] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#2962ff]" />
                <span className="text-[#d1d4dc] font-medium">SNIPER OSC</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-3 h-0.5 rounded bg-white"></span>
                <span className="text-[#787b86] text-[10px]">EMA200</span>
                <span className="w-3 h-0.5 rounded bg-[#ef5350]"></span>
                <span className="text-[#787b86] text-[10px]">MA7</span>
                <span className="w-3 h-0.5 rounded bg-[#66bb6a]"></span>
                <span className="text-[#787b86] text-[10px]">MA13</span>
                <span className="w-3 h-0.5 rounded bg-[#2962ff]"></span>
                <span className="text-[#787b86] text-[10px]">MA5</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[#ef5350] font-medium">80</span>
                <span className="text-[#787b86] text-[10px]">OB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#26a69a] font-medium">20</span>
                <span className="text-[#787b86] text-[10px]">OS</span>
              </div>
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#2a2e39] text-[#2962ff] transition-colors"
              >
                <HelpCircle className="h-3 w-3" />
                <span className="hidden sm:inline">Guide</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar - Mobile Optimized */}
      <div className="h-[36px] sm:h-[32px] px-2 bg-[#131722] border-t border-[#363a45] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
          {/* Signal - Hidden on mobile (shown in mobile quick bar) */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded ${signalInfo.bg}`}>
            <SignalIcon className={`h-3.5 w-3.5 ${signalInfo.color}`} />
            <span className={`font-normal ${signalInfo.color}`}>{signalInfo.text}</span>
          </div>

          {/* Mobile: Compact indicators */}
          <div className="flex sm:hidden items-center gap-2">
            {/* RSI */}
            {marketData?.rsi && (
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                marketData.rsi > 70 ? 'bg-[#ef5350]/20 text-[#ef5350]' :
                marketData.rsi < 30 ? 'bg-[#26a69a]/20 text-[#26a69a]' :
                'bg-[#787b86]/20 text-[#d1d4dc]'
              }`}>
                RSI {Math.round(marketData.rsi)}
              </div>
            )}

            {/* Sniper */}
            {indicators.sniperOsc && (() => {
              const kArr = marketData?.sniperOscillator?.k;
              const lastK = kArr && kArr.length > 0 ? kArr[kArr.length - 1] : null;
              const kValue = lastK && typeof lastK.value === 'number' ? lastK.value : null;
              if (kValue === null) return null;
              return (
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  kValue > 80 ? 'bg-[#ef5350]/20 text-[#ef5350]' :
                  kValue < 20 ? 'bg-[#26a69a]/20 text-[#26a69a]' :
                  'bg-[#ffca28]/20 text-[#ffca28]'
                }`}>
                  OSC {Math.round(kValue)}
                </div>
              );
            })()}
          </div>

          {/* Desktop: Full indicators */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Separator */}
            <div className="w-px h-4 bg-[#363a45]" />

            {/* RSI Value */}
            {marketData?.rsi && (
              <div className="flex items-center gap-1">
                <span className="text-[#787b86]">RSI:</span>
                <span className={`font-mono font-medium ${
                  marketData.rsi > 70 ? 'text-[#ef5350]' : marketData.rsi < 30 ? 'text-[#26a69a]' : 'text-[#d1d4dc]'
                }`}>
                  {Math.round(marketData.rsi)}
                </span>
              </div>
            )}

            {/* Sniper Value */}
            {indicators.sniperOsc && (() => {
              const kArr = marketData?.sniperOscillator?.k;
              const lastK = kArr && kArr.length > 0 ? kArr[kArr.length - 1] : null;
              const kValue = lastK && typeof lastK.value === 'number' ? lastK.value : null;
              if (kValue === null) return null;
              const colorClass = kValue > 80 ? 'text-[#ef5350]' : kValue < 20 ? 'text-[#26a69a]' : 'text-[#ffca28]';
              return (
                <div className="flex items-center gap-1">
                  <span className="text-[#787b86]">Sniper:</span>
                  <span className={`font-mono font-medium ${colorClass}`}>{Math.round(kValue)}</span>
                </div>
              );
            })()}

            {/* EMA Values - Desktop only */}
            <div className="hidden md:flex items-center gap-3">
              {indicators.emaFast && marketData?.currentEmas?.fast && (
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 rounded bg-[#00bcd4]"></span>
                  <span className="text-[#00bcd4] font-mono">{formatPrice(marketData.currentEmas.fast)}</span>
                </div>
              )}
              {indicators.emaMid && marketData?.currentEmas?.mid && (
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 rounded bg-[#ffca28]"></span>
                  <span className="text-[#ffca28] font-mono">{formatPrice(marketData.currentEmas.mid)}</span>
                </div>
              )}
              {indicators.emaSlow && marketData?.currentEmas?.slow && (
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 rounded bg-[#e91e63]"></span>
                  <span className="text-[#e91e63] font-mono">{formatPrice(marketData.currentEmas.slow)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Trend Indicator */}
          {indicators.adaptiveTrend && marketData?.priceData?.length > 0 && (() => {
            const lastCandle = marketData.priceData[marketData.priceData.length - 1];
            const isBullish = lastCandle.close > lastCandle.open;
            return (
              <div className="hidden lg:flex items-center gap-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isBullish ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                  {isBullish ? 'BULLISH' : 'BEARISH'}
                </span>
              </div>
            );
          })()}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {lastUpdated && (
            <div className="hidden sm:flex items-center gap-1 text-[#787b86]">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3 text-[#2962ff]" />
            <span className="text-[#2962ff] font-normal">Market Sniper</span>
          </div>
        </div>
      </div>

      {/* Market Closed Notice */}
      {!isCrypto && !isMarketOpen && (
        <div className="px-3 sm:px-4 py-2 bg-amber-500/5 border-t border-amber-500/20 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <span className="text-xs text-amber-400">Market closed. Showing last traded prices.</span>
        </div>
      )}


      {/* Click Outside Handler */}
      {(showAssetSearch || showIndicatorMenu || showMobileTimeframes) && (
        <div
          className={`fixed inset-0 bg-black/50 ${fullscreen ? 'z-[9999998]' : 'z-[9998]'}`}
          onClick={() => {
            setShowAssetSearch(false);
            setShowIndicatorMenu(false);
            setShowMobileTimeframes(false);
          }}
        />
      )}

      {/* Indicator Guide Modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="bg-[#1e222d] rounded-xl border border-[#2a2e39] max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#2a2e39]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2962ff] to-[#1e53e4] rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-white font-normal">Sniper Indicator Guide</h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-[#787b86] hover:text-white p-1 hover:bg-[#2a2e39] rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(85vh-80px)]">
              <div>
                <h4 className="text-white font-medium mb-3">Oscillator Lines</h4>
                <div className="space-y-2">
                  {[
                    { color: '#ffffff', name: 'EMA 200', desc: 'Long-term trend. Above = bullish, below = bearish' },
                    { color: '#ef5350', name: 'Signal Line (7)', desc: 'Fast signal for entry/exit' },
                    { color: '#66bb6a', name: 'Slow Line (13)', desc: 'Confirms trend direction' },
                    { color: '#2962ff', name: 'Fast Line (5)', desc: 'Quickest response for scalping' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg bg-[#131722]">
                      <div className="w-4 h-1 rounded mt-1.5" style={{ backgroundColor: item.color }} />
                      <div>
                        <span className="text-white font-medium text-sm">{item.name}</span>
                        <p className="text-[#787b86] text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Key Zones</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-[#ef5350]/10 border border-[#ef5350]/20">
                    <span className="text-[#ef5350] font-normal text-sm">80+ Overbought</span>
                    <p className="text-[#787b86] text-xs mt-1">Potential sell zone</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#26a69a]/10 border border-[#26a69a]/20">
                    <span className="text-[#26a69a] font-normal text-sm">20- Oversold</span>
                    <p className="text-[#787b86] text-xs mt-1">Potential buy zone</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">How to Trade</h4>
                <div className="space-y-2 text-sm">
                  {[
                    'Look for crossovers between Red and Green lines',
                    'Buy when oscillator is in oversold zone (below 20)',
                    'Sell when oscillator is in overbought zone (above 80)',
                    'Use White EMA 200 to confirm overall trend',
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#787b86]">
                      <span className="text-[#2962ff] font-normal">{i + 1}.</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // For iOS fullscreen, render via portal to escape parent stacking contexts
  if (isIOSFullscreen && isMounted && typeof document !== 'undefined') {
    return createPortal(chartContent, document.body);
  }

  return chartContent;
}
