'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function EMAChart({ priceData, ema9, ema21, ema50 }) {
  const [signal, setSignal] = useState({ text: 'Loading...', color: 'text-muted' });

  useEffect(() => {
    if (ema9?.length > 0 && ema21?.length > 0) {
      const latestEma9 = ema9[ema9.length - 1].value;
      const latestEma21 = ema21[ema21.length - 1].value;

      if (latestEma9 > latestEma21) {
        setSignal({ text: 'Bullish Crossover', color: 'text-accent', icon: TrendingUp });
      } else if (latestEma9 < latestEma21) {
        setSignal({ text: 'Bearish Crossover', color: 'text-danger', icon: TrendingDown });
      } else {
        setSignal({ text: 'Neutral', color: 'text-muted', icon: Activity });
      }
    }
  }, [ema9, ema21]);

  const SignalIcon = signal.icon || Activity;

  // Get common dates
  const dates = priceData?.map(d => d.date) || [];

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Price',
        data: priceData?.map(d => d.close) || [],
        borderColor: '#ffffff',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.1,
      },
      {
        label: 'EMA 9',
        data: dates.map(date => {
          const emaPoint = ema9?.find(e => e.date === date);
          return emaPoint ? emaPoint.value : null;
        }),
        borderColor: '#22c55e',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'EMA 21',
        data: dates.map(date => {
          const emaPoint = ema21?.find(e => e.date === date);
          return emaPoint ? emaPoint.value : null;
        }),
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'EMA 50',
        data: dates.map(date => {
          const emaPoint = ema50?.find(e => e.date === date);
          return emaPoint ? emaPoint.value : null;
        }),
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#9ca3af',
          usePointStyle: true,
          pointStyle: 'line',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#111111',
        borderColor: '#1f2937',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#9ca3af',
        padding: 12,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw?.toFixed(2) || 'N/A'}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: '#1f2937',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          color: '#1f2937',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const latestPrice = priceData?.[priceData.length - 1]?.close;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg">EMA Crossover</h3>
          <p className="text-muted text-sm">Exponential Moving Averages (9, 21, 50)</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {latestPrice ? `₹${latestPrice.toFixed(2)}` : '--'}
          </div>
          <div className={`flex items-center justify-end space-x-1 ${signal.color}`}>
            <SignalIcon className="h-4 w-4" />
            <span className="text-sm">{signal.text}</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-accent font-semibold">
            {ema9?.[ema9.length - 1]?.value.toFixed(2) || '--'}
          </div>
          <div className="text-muted">EMA 9</div>
        </div>
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-blue-500 font-semibold">
            {ema21?.[ema21.length - 1]?.value.toFixed(2) || '--'}
          </div>
          <div className="text-muted">EMA 21</div>
        </div>
        <div className="bg-black/50 rounded-lg p-3">
          <div className="text-amber-500 font-semibold">
            {ema50?.[ema50.length - 1]?.value.toFixed(2) || '--'}
          </div>
          <div className="text-muted">EMA 50</div>
        </div>
      </div>
    </div>
  );
}
