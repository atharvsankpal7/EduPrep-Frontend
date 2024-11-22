"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TimeSpentAnalysisProps {
  timeRange: string;
}

export function TimeSpentAnalysis({ timeRange }: TimeSpentAnalysisProps) {
  const data = {
    labels: ["Mathematics", "Science", "English", "History"],
    datasets: [
      {
        label: "Hours Spent",
        data: [12, 8, 6, 4],
        backgroundColor: [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
        ],
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
      <Bar data={data} options={options} />
    </div>
  );
}