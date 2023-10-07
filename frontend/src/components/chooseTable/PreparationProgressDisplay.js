import {Alert, Skeleton, Steps, Typography} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {preparationStatus} from "../../api/tablesOrders";
import PropTypes from "prop-types";

const {Title} = Typography;

export const PreparationProgressDisplay = (props) => {
    const {table} = props;

    const [preparationCompleted, setPreparationCompleted] = useState(null);
    const [preparationTime, setPreparationTime] = useState(null);

    useEffect(() => {
        preparationStatus(table.tableOrderId).then(res => {
            const {preparationCompleted, preparationTime} = res.data;
            setPreparationCompleted(preparationCompleted);
            setPreparationTime(preparationTime);
        });
    }, []);

    if (preparationCompleted == null && preparationTime == null) return (
        <div>
            <Alert message="Retrieving information in progress..." type="info" showIcon/>
            <Skeleton active/>
        </div>
    );
    return (
        <div>
            <Title level={4}>Table n°{table.number}</Title>
            <Steps current={preparationCompleted ? 2 : 1} style={{paddingBlock: "10px"}}
                   items={[
                       {
                           title: 'Sent to the kitchen'
                       },
                       {
                           title: 'In preparation',
                           subTitle: preparationTime,
                           icon: preparationCompleted ? '' : <LoadingOutlined/>,
                       },
                       {
                           title: 'Order ready'
                       },
                   ]}
            />
        </div>
    );
}

PreparationProgressDisplay.propTypes = {
    table: PropTypes.any
}