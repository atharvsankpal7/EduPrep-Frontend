"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function SubjectDistribution() {
  const data = {
    labels: ["Mathematics", "Science", "English", "History"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
          padding: window.innerWidth < 768 ? 10 : 20,
        },
      },
    },
  };

  return (
    <div className="w-full h-[250px] md:h-[300px] flex items-center justify-center">
      <Pie data={data} options={options} />
    </div>
  );
}