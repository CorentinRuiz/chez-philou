import {Modal, Select, Steps, Typography} from "antd";
import PropTypes from "prop-types";
import {PREPARATION_IN_PROGRESS, READY_TO_SERVE, TABLE_AVAILABLE, TABLE_BLOCKED} from "./Constants";
import {LoadingOutlined} from '@ant-design/icons';

const {Title} = Typography;

const unlockTableModal = (table, onModalResponse) => {
    Modal.confirm({
        title: "Unlock Table",
        content: `Do you want to unlock table ${table?.tableNumber}?`,
        onOk: () => onModalResponse(table, true),
        okText: "Unlock",
        cancelText: "Cancel"
    });
}

const preparationProgressDisplay = (table, timeRemaining) => {
    return (
        <div>
            <Title level={4}>Table n°{table.tableNumber}</Title>
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

const preparationInProgressModal = (table) => {
    Modal.info({
        title: "Preparation in progress...",
        content: preparationProgressDisplay(table, 10)
    })
}

const orderReadyModal = (table, onModalResponse) => {
    Modal.confirm({
        title: "Order ready",
        content: preparationProgressDisplay(table),
        okText: "Confirm delivery",
        cancelText: "Wait",
        onOk: () => onModalResponse(table, true)
    })
}

const openNewTable = (table, onModalResponse) => {
    let numberOfPerson = 1;

    Modal.confirm({
        title: "Opening a table",
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

const displayUnknownModal = () => {
    Modal.error({
        title: "Unknown error",
        content: "Unknown error. Sorry..."
    });
}

export const openModalDisplay = (table, onModalResponse) => {
    if (table) {
        switch (table.state) {
            case TABLE_AVAILABLE:
                openNewTable(table, onModalResponse);
                break;
            case TABLE_BLOCKED:
                unlockTableModal(table, onModalResponse);
                break;
            case PREPARATION_IN_PROGRESS:
                preparationInProgressModal(table);
                break;
            case READY_TO_SERVE:
                orderReadyModal(table, onModalResponse);
                break;
            default:
                displayUnknownModal();
        }
    }
}


openModalDisplay.propTypes = {
    table: PropTypes.any,
    onModalResponse: PropTypes.func
}

export default openModalDisplay;