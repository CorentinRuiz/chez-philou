import {Modal, Select, Typography, Collapse} from "antd";
import TextArea from "antd/es/input/TextArea";
import {Grid, IconButton} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import React from "react";
import {PreparationProgressDisplay} from "./PreparationProgressDisplay";

const {Title} = Typography;

export const unlockTableModal = (table, onModalResponse) => {
    Modal.confirm({
        title: "Unlock Table",
        content: `Do you want to unlock table ${table?.number}?`,
        onOk: () => onModalResponse(table, true),
        okText: "Unlock",
        cancelText: "Cancel"
    });
}

export const preparationInProgressModal = (table) => {
    Modal.info({
        title: "Preparation in progress...",
        content: <PreparationProgressDisplay table={table}/>
    })
}

export const orderReadyModal = (table, onModalResponse) => {
    Modal.confirm({
        title: "Order ready",
        content: <PreparationProgressDisplay table={table}/>,
        okText: "Confirm delivery",
        cancelText: "Wait",
        onOk: () => onModalResponse(table, true)
    })
}

export const lockTableModal = (table, onModalResponse) => {
    Modal.confirm({
        title: 'Lock table',
        content: <Title level={5}>Do you want to block table n°{table?.number}?</Title>,
        okText: 'Lock', cancelText: 'Cancel',
        onOk: () => onModalResponse(table, "lock"),
    });
}

export const billModal = (orders, onModalResponse, tableOrderId, totalOrderPrice) => {
    Modal.confirm({
        title: 'Create Bill',
        content: (
            <div>
                <Title>Receipt</Title>
                <Collapse bordered={false} items={orders} />
                <Title level={5} style={{marginTop: "5px", color: "#9899A7"}}>Total {totalOrderPrice} €</Title>
            </div>
        ),
        okText: 'Create Bill', cancelText: 'Cancel',
        onOk: () => onModalResponse(tableOrderId),
    });
}

export const openNewTable = (table, onModalResponse) => {
    let numberOfPerson = 1;

    Modal.confirm({
        title: <div>
            <Grid container alignItems="center">
                <Grid item xs={10}>Opening a table - Table {table.number}</Grid>
                <Grid item xs={2}><IconButton aria-label="lock" style={{padding: 0}} onClick={() => {
                    Modal.destroyAll();
                    onModalResponse(table, "lock")
                }}><LockIcon/></IconButton></Grid>
            </Grid>
        </div>,
        content: <div>
            <Title level={5}>How many people will sit at this table?</Title>
            <Select
                defaultValue="1"
                style={{width: 120}}
                onChange={(newValue) => numberOfPerson = newValue}
                options={Array.from({length: 20}, (_, i) => ({label: i + 1, value: i + 1}))}
            />
        </div>,
        okText: "Open",
        cancelText: "Cancel",
        onOk: () => onModalResponse(table, numberOfPerson)
    });
}

export const displayAddCommentModal = (item, onModalResponse) => {
    let comment = "";
    Modal.confirm({
        title: `Add a comment`,
        content: <div>
            <Title level={5}>Add a comment to item </Title>
            <TextArea
                defaultValue=""
                onChange={(e) => comment = e.target.value}
            />
        </div>,
        okText: "Add",
        cancelText: "Cancel",
        onOk: () => onModalResponse(item, comment)
    });
}

export const displayUnknownModal = () => {
    Modal.error({
        title: "Unknown error",
        content: "Unknown error. Sorry..."
    });
}

export const openAddCommentModal = (item, onModalResponse) => {
    displayAddCommentModal(item, onModalResponse);
}