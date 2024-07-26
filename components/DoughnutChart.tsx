'use client';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import React from 'react';

export default function DoughnutChart({ accounts = [] }: DoughnutChartProps) {
  const accountNames = accounts.map((account) => account.name);
  const accountBalances = accounts.map((account) => account.currentBalance);

  const data = {
    datasets: [
      {
        label: 'Banks',
        data: accountBalances,
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
      },
    ],
    labels: accountNames,
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: '60%',
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}
