"use client";

import { Line } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceChartProps {
  timeRange: string;
}

export function PerformanceChart({ timeRange }: PerformanceChartProps) {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Score",
        data: [65, 72, 68, 85, 75, 80, 78],
        borderColor: "hsl(var(--primary))",
        backgroundColor: "color-mix(in srgb, hsl(var(--primary)) 10%, transparent)",
        fill: true,
        tension: 0.4,
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
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[250px] md:h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
}