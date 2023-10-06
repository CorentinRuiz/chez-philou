import { Box, Paper, Typography } from "@mui/material";
import TextArea from "antd/es/input/TextArea";
import React from "react";

const OrderItem = ({ item, color }) => {
  const { quantity, shortName, price, comment } = item;

  return (
    <Box margin="10px" display="flex" justifyContent="space-between">
      <Box display="flex">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            height:
              comment !== null && typeof comment !== "undefined"
                ? "100px"
                : "50px",
          }}
        >
          <Paper
            sx={{
              borderRadius: 50,
              width: "30px",
              height: "30px",
              backgroundColor: color,
            }}
          >
            <Box
              sx={{ height: "30px" }}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {quantity}
            </Box>
          </Paper>
          <div style={{ borderRight: "solid 2px #CECBCB", height: "100%" }} />
        </Box>
        <Box display="flex" flexDirection="column" marginLeft={2}>
          <Typography variant="h6">
            {shortName.charAt(0).toUpperCase() + shortName.slice(1)}
          </Typography>
          {comment !== null && typeof comment !== "undefined" ? (
            <TextArea
              disabled
              style={{ resize: "none", marginTop: "5px" }}
              defaultValue={comment}
              rows={2}
            />
          ) : (
            ""
          )}
        </Box>
      </Box>
      <Typography variant="body-1" paddingTop="5px">
        {quantity} x {price} €
      </Typography>
    </Box>
  );
};

export default OrderItem;
