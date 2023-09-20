import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

const AppBar = () => {
  const { id } = useParams();
  const location = useLocation();
  console.log(id);

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Typography style={{ marginTop: 15 }} level={3}>
          {location.pathname === "/" ? "Table selection" : "Order"}
        </Typography>
        {location.pathname.includes("/takeOrder") ? (
          <Typography>Table n°{id}</Typography>
        ) : (
          ""
        )}
        <Divider style={{ margin: 0 }} />
      </Box>
    </div>
  );
};

export default AppBar;
