import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from '../title/title';
import { useLocation } from "react-router-dom";

function preventDefault(event) {
  event.preventDefault();
}

export default function Summary() {
  const location = useLocation();
  const total_investment = Number(location.state.funds["Total_Investment"]).toFixed(2);
  const total_value = Number(location.state.funds["Total_Value"]).toFixed(2);
  const gain = Number(location.state.funds["Total_Gain"]).toFixed(2);
  const gain_p = Number(location.state.funds["Gain_Percentage"]).toFixed(2);
  const last_update_time = location.state.funds["Time_Updated"];
  const tokenCount = location.state.funds["Funds"].length;
  const styleObj = gain < 0 ? { color: "red" } : { color: "green" };
  const boldStyle = { fontWeight: 'bold' };
  return (
    <React.Fragment>
      <Title>Summary</Title>
      <Typography component="p" variant="h6" sx={{ m: 1 }}>
        Total Number of Tokens : {tokenCount}
      </Typography>
      <Typography component="p" variant="h6" sx={{ m: 1 }}>
        Total Investment : Rs {total_investment}
      </Typography>
      <Typography component="p" variant="h6" sx={{ m: 1 }}>
        Total Current Value : Rs {total_value}
      </Typography>
      <Typography style={styleObj} component="p" variant="h6" sx={{ m: 1 }}>
        Total Gain/Loss : Rs {gain}
      </Typography>
      <Typography style={styleObj} component="p" variant="h6" sx={{ m: 1 }}>
        Gain/Loss (%) : {gain_p}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1, m: 1 }}>
        Last Updated Time : {last_update_time}
      </Typography>
    </React.Fragment>
  );
}
