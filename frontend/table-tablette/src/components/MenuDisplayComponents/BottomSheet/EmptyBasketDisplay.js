import React from "react";
import { Stack } from "@mui/material";
import { Alert, Typography } from "antd";

const EmptyBasketDisplay = ({ totalOrderPrice, orderState }) => {
  return (
    <div>
      <Stack
        direction="column"
        style={{ margin: "20px" }}
        alignItems="center"
        spacing={3}
      >
        <Alert
          message="The order is empty"
          type="info"
          showIcon
          description="There are no items in the order."
        />
        {orderState > 0 ? (
          <Typography>Total Order {totalOrderPrice()} € </Typography>
        ) : null}
      </Stack>
    </div>
  );
};

export default EmptyBasketDisplay;
