import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../title/title';
import { useLocation } from "react-router-dom";

export default function TokenStatus() {
  const location = useLocation();
  let funds = location.state.funds['Funds'];
  const redText = {
    color: "red"
  };
  const greenText = {
    color: "green"
  };
  funds.map((row) => {
    row.styleObject = row.Gain < 0 ? redText : greenText;
  });
  return (
    <React.Fragment>
      <Title>Current Status</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight: 'bold'}}>Token</TableCell>
            <TableCell style={{fontWeight: 'bold'}}>Current Price</TableCell>
            <TableCell style={{fontWeight: 'bold'}}>Holdings</TableCell>
            <TableCell style={{fontWeight: 'bold'}}>Current Value</TableCell>
            <TableCell style={{fontWeight: 'bold'}}>Total Investment</TableCell>
            <TableCell style={{fontWeight: 'bold'}}>Avg Buy Price</TableCell>
            <TableCell style={{fontWeight: 'bold'}}>Gain</TableCell>
            <TableCell align="right" style={{fontWeight: 'bold'}}>Gain (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {funds.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.Token}</TableCell>
              <TableCell>{row.Current_Price}</TableCell>
              <TableCell>{row.Holdings}</TableCell>
              <TableCell>{row.Current_Value}</TableCell>
              <TableCell>{row.Total_Investment}</TableCell>
              <TableCell>{row.Avg_Buy_Price}</TableCell>
              <TableCell style={row.styleObject}>{row.Gain}</TableCell>
              <TableCell style={row.styleObject} align="right">{row.Gain_Perc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}