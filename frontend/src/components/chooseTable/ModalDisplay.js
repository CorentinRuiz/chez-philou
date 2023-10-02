import {Modal, Select, Steps, Typography} from "antd";
import PropTypes from "prop-types";
import {PREPARATION_IN_PROGRESS, READY_TO_SERVE, TABLE_AVAILABLE, TABLE_BLOCKED} from "./Constants";
import {LoadingOutlined} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import {Grid, IconButton} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import React from "react";

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

const preparationProgressDisplay = (table, timeRemaining) => {
    return (
        <div>
            <Title level={4}>Table n°{table.number}</Title>
            <Steps current={timeRemaining ? 1 : 2} style={{paddingBlock: "10px"}}
                   items={[
                       {
                           title: 'Sent to the kitchen',
                       },
                       {
                           title: 'In preparation',
                           subTitle: timeRemaining ? `${timeRemaining}min left` : '',
                           icon: timeRemaining ? <LoadingOutlined/> : '',
                       },
                       {
                           title: 'Order ready',
                       },
                   ]}
            />
        </div>
    );
}

export const preparationInProgressModal = (table) => {
    Modal.info({
        title: "Preparation in progress...",
        content: preparationProgressDisplay(table, 10)
    })
}

export const orderReadyModal = (table, onModalResponse) => {
    Modal.confirm({
        title: "Order ready",
        content: preparationProgressDisplay(table),
        okText: "Confirm delivery",
        cancelText: "Wait",
        onOk: () => onModalResponse(table, true)
    })
}

export const lockTableModal = (table, onModalResponse) => {
    Modal.confirm({
        title: 'Lock table',
        content: <Title level={5}>Do you want to block table n°{table.tableNumber}?</Title>,
        okText: 'Lock', cancelText: 'Cancel',
        onOk: () => onModalResponse(table, "lock"),
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

export const displayAddCommentModal = (itemName, onModalResponse) => {
    let comment = "";

    Modal.confirm({
        title: `Add a comment`,
        content: <div>
            <Title level={5}>Add a comment to item {itemName}</Title>
            <TextArea
                defaultValue=""
                onChange={(newValue) => comment = newValue}
            />
        </div>,
        okText: "Add",
        cancelText: "Cancel",
        onOk: () => onModalResponse(itemName, comment)
    });
}

export const displayUnknownModal = () => {
    Modal.error({
        title: "Unknown error",
        content: "Unknown error. Sorry..."
    });
}

export const openAddCommentModal = () => {
    displayAddCommentModal();
}