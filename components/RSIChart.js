'use client';

import { useEffect, useRef, useState } from 'react';
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
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

export default function RSIChart({ data, period = 14 }) {
  const [currentRSI, setCurrentRSI] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setCurrentRSI(data[data.length - 1].value);
    }
  }, [data]);

  const getSignal = () => {
    if (!currentRSI) return { text: 'Loading...', color: 'text-muted' };
    if (currentRSI > 70) return { text: 'Overbought - Sell Signal', color: 'text-danger', icon: TrendingDown };
    if (currentRSI < 30) return { text: 'Oversold - Buy Signal', color: 'text-accent', icon: TrendingUp };
    return { text: 'Neutral', color: 'text-muted', icon: Activity };
  };

  const signal = getSignal();
  const SignalIcon = signal.icon || Activity;

  const chartData = {
    labels: data?.map((d) => d.date) || [],
    datasets: [
      {
        label: `RSI (${period})`,
        data: data?.map((d) => d.value) || [],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Overbought (70)',
        data: data?.map(() => 70) || [],
        borderColor: '#ef4444',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Oversold (30)',
        data: data?.map(() => 30) || [],
        borderColor: '#22c55e',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            if (context.datasetIndex === 0) {
              return `RSI: ${context.raw.toFixed(2)}`;
            }
            return '';
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
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
        min: 0,
        max: 100,
        grid: {
          color: '#1f2937',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          stepSize: 20,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg">RSI Indicator</h3>
          <p className="text-muted text-sm">Relative Strength Index ({period}-period)</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {currentRSI ? currentRSI.toFixed(2) : '--'}
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

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-danger" />
          <span className="text-muted">Overbought (70+)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-muted">Oversold (30-)</span>
        </div>
      </div>
    </div>
  );
}
