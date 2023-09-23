import { Box, Paper, Typography } from "@mui/material";
import React from "react";

const OrderItem = ({ items, color }) => {
  const { quantity, name, comment, price } = items;

  return (
    <Box margin="10px" display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center">
        <Paper
          sx={{
            borderRadius: 50,
            width: "30px",
            height: "30px",
            backgroundColor: color,
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            {quantity}
          </Box>
        </Paper>
        <Typography marginLeft={1} variant="h6">{name}</Typography>
      </Box>
      <Typography variant="body-1">{price} €</Typography>
    </Box>
  );
};

export default OrderItem;
