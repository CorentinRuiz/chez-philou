import {Box, Typography, Button, IconButton} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import React from "react";
import {openRecapBasket} from "../../../api/tablesOrders";
import {message} from "antd";

const BottomSheetHeader = ({nbItems, totalPrice, onSendOrder, tableNumber, basket}) => {
    const [messageApi, messageContextHolder] = message.useMessage();

    const openRecapOnTablette = () => {
        openRecapBasket(tableNumber, [...basket]).then(() => {
            messageApi.info("Recap opened on tablette");
        });
    }

    return (
        <Box display="flex" justifyContent="space-between" margin="10px" sx={{overflow: "hidden"}}>
            {messageContextHolder}
            <Box display="flex" flexDirection="column">
                <Typography variant="h5" color="#5F69DD">
                    {nbItems} Items
                </Typography>
                <Typography color="#9899A7">
                    Total {totalPrice} €
                </Typography>
            </Box>
            <Box display="flex" flexDirection="row">
                <IconButton color="primary" onClick={openRecapOnTablette}>
                    <OpenInNewIcon/>
                </IconButton>
                <Button disabled={nbItems === 0} onClick={onSendOrder} sx={{backgroundColor: "#EBECFB"}}>
                    Send Order
                </Button>
            </Box>
        </Box>
    );
};

export default BottomSheetHeader;
