import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const Chart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        label: 'Visitors',
        data: data.map(item => item.count),
        borderColor: '#d4af37',
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#d4af37',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#d4af37',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Roboto', sans-serif",
          },
          color: '#1a2a44',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Visitor Trends Over Time',
        font: {
          size: 24,
          weight: 'bold',
          family: "'Playfair Display', serif",
        },
        color: '#1a2a44',
        padding: {
          top: 20,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 42, 68, 0.9)',
        titleFont: { size: 16, family: "'Roboto', sans-serif" },
        bodyFont: { size: 14, family: "'Roboto', sans-serif" },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 16,
            family: "'Roboto', sans-serif",
          },
          color: '#1a2a44',
          padding: 10,
        },
        ticks: {
          color: '#1a2a44',
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Visitors',
          font: {
            size: 16,
            family: "'Roboto', sans-serif",
          },
          color: '#1a2a44',
          padding: 10,
        },
        ticks: {
          color: '#1a2a44',
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
          beginAtZero: true,
        },
        grid: {
          color: 'rgba(26, 42, 68, 0.1)',
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] sm:h-[500px] p-6 bg-white rounded-xl card-shadow">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;