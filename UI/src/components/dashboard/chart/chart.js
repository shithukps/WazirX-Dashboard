import React from 'react';
import { useTheme } from '@mui/material/styles';
import { ResponsiveContainer } from 'recharts';
import Title from '../title/title';
import { useLocation } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

let bgColors = [];
for (var i = 0; i < 50; i++) {
  bgColors.push(getRandomColor());
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function Chart() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const theme = useTheme();
  const location = useLocation();
  const funds = location.state.funds['Funds'];
  let labels = [];
  let values = [];

  for (var i = 0; i < funds.length; i++) {
    var record = funds[i];
    labels.push(record['Token']);
    values.push(record['Total_Investment']);
  }
  const data = {
    labels: labels,
    datasets: [
      {
        label: '# of Votes',
        data: values,
        borderWidth: 1,
        backgroundColor: bgColors.slice(0, funds.length - 1)
      },
    ],
  };
  return (
    <React.Fragment>
      <Title>Holdings</Title>
      <ResponsiveContainer width="100%" height="100%">
        <div>
          <Doughnut data={data} height={"280%"} options={{ maintainAspectRatio: false }} />
        </div>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
