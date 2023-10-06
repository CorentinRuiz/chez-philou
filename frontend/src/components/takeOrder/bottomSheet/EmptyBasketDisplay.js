import React from "react";
import { Stack } from "@mui/material";
import { Button, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const EmptyBasketDisplay = ({ orderState, closeBottomSheet, onCreateBill }) => {
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
        <Button
          icon={<PlusOutlined />}
          size="large"
          onClick={closeBottomSheet}
          type="primary"
        >
          Add item
        </Button>

        {orderState > 0 ? (
          <>
            <Button size="large" onClick={onCreateBill} type="primary">
              Create Bill
            </Button>
          </>
        ) : null}
      </Stack>
    </div>
  );
};

export default EmptyBasketDisplay;
