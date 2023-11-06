import { Box, Typography, Button } from "@mui/material";
import React from "react";

const BottomSheetHeader = ({ nbItems, totalPrice }) => {
  return (
    <Box display="flex" justifyContent="space-between" margin="10px" sx={{overflow: "hidden"}}>
      <Box display="flex" flexDirection="column">
        <Typography variant="h5" color="#5F69DD">
          {nbItems} Items
        </Typography>
        <Typography  color="#9899A7">
          Total {totalPrice} €
        </Typography>
      </Box>
    </Box>
  );
};

export default BottomSheetHeader;
