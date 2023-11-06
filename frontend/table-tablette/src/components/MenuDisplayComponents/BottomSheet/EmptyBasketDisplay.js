import React from "react";
import { Stack } from "@mui/material";
import { Button, Alert, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const EmptyBasketDisplay = ({ closeBottomSheet }) => {
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
          description="There are no items in the order. You can add more using the selection table above."
        />
      </Stack>
    </div>
  );
};

export default EmptyBasketDisplay;
