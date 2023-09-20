import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useLocation } from "react-router-dom";

const AppBar = () => {
  const location = useLocation();
  const tableId = location.pathname.split("/takeOrder/")[1];

  return (
    <div>
      <Box sx={{ width: "100%", }} display="flex" alignItems="center" justifyContent="space-between" marginTop="15px">
        <Typography level={3}>
          {location.pathname === "/" ? "Table selection" : "Order"}
        </Typography>
        {location.pathname.includes("/takeOrder") ? (
          <Typography>Table n°{tableId}</Typography>
        ) : (
          ""
        )}
      </Box>
      <Divider style={{ margin: 0 }} />
    </div>
  );
};

export default AppBar;
