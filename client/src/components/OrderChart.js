// src/components/OrderPieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../css/OrderChart.css'; // Import the CSS file

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderChart = ({ orders }) => {
  const productData = {};

  // Aggregate order data
  orders.forEach(order => {
    order.cartItems.forEach(item => {
      const productName = item.bookId.title; // Assuming the book details are populated
      productData[productName] = (productData[productName] || 0) + item.quantity;
    });
  });

  const data = {
    labels: Object.keys(productData),
    datasets: [
      {
        data: Object.values(productData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF9F40',
          '#4BC0C0',
          '#9966FF',
          '#FF6384'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF9F40',
          '#4BC0C0',
          '#9966FF',
          '#FF6384'
        ]
      }
    ]
  };

  return (
    <div className="pie-chart-container1">
      <h2>Order Statistics</h2>
      <div className="pie-chart-container">

        <Pie data={data} />
      </div>
    </div>
  );
};

export default OrderChart;
