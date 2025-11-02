import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface LanguageChartProps {
  languages: Record<string, number>;
}

export default function LanguageChart({ languages }: LanguageChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = Object.keys(languages);
    const data = Object.values(languages);

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Language Distribution',
            data,
            backgroundColor: [
              '#667eea',
              '#764ba2',
              '#48bb78',
              '#ed8936',
              '#4299e1',
              '#9f7aea',
            ],
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
            },
          },
          title: {
            display: true,
            text: 'Language Distribution',
            color: 'rgba(255, 255, 255, 0.9)',
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [languages]);

  return <canvas ref={chartRef} />;
}
