import React from 'react'
import {Box, Grid} from "@mui/material";
import PropTypes from "prop-types";
import TableButton from "../components/chooseTable/TableButton";
import openModalDisplay from "../components/chooseTable/ModalDisplay";
import {
    PREPARATION_IN_PROGRESS,
    READY_TO_SERVE,
    TABLE_AVAILABLE,
    TABLE_BLOCKED
} from "../components/chooseTable/Constants";
import {FloatButton, InputNumber, message, Modal, Typography} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {wait} from "@testing-library/user-event/dist/utils";

const {Title} = Typography;

const ChooseTablePage = (props) => {
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();

    const tables = [
        {tableNumber: 1, state: PREPARATION_IN_PROGRESS},
        {tableNumber: 2, state: TABLE_AVAILABLE},
        {tableNumber: 3, state: READY_TO_SERVE},
        {tableNumber: 4, state: TABLE_AVAILABLE},
        {tableNumber: 5, state: TABLE_BLOCKED},
        {tableNumber: 6, state: TABLE_AVAILABLE},
        {tableNumber: 7, state: TABLE_AVAILABLE},
        {tableNumber: 8, state: TABLE_AVAILABLE},
        {tableNumber: 9, state: TABLE_AVAILABLE},
        {tableNumber: 10, state: TABLE_AVAILABLE},
        {tableNumber: 11, state: TABLE_AVAILABLE},
        {tableNumber: 12, state: TABLE_AVAILABLE},
        {tableNumber: 13, state: TABLE_AVAILABLE},
        {tableNumber: 14, state: TABLE_AVAILABLE},
        {tableNumber: 15, state: TABLE_AVAILABLE},
        {tableNumber: 16, state: TABLE_AVAILABLE},
    ]

    const handleOnClick = (table) => {
        openModalDisplay(table, handleModalResponse);
    }

    const handleModalResponse = (table, response) => {
        // Débloquer une table
        if (table.state === TABLE_BLOCKED && response === true) {
            messageApi.loading(`Unlocking table ${table.tableNumber}...`, 2.5)
                .then(() => messageApi.success(`Table ${table.tableNumber} unlocked`));
            console.log("débloquer");
        }

        // Délivrer
        else if (table.state === READY_TO_SERVE && response === true) {
            messageApi.success(`Table ${table.tableNumber} delivered`);
            console.log("livrer");
        }

        // Ouverture nouvelle table
        else if (table.state === TABLE_AVAILABLE) {
            messageApi.loading(`Opening of table ${table.tableNumber} in progress`, 2)
                .then(() => {
                    navigate(`/takeOrder/${table.tableNumber}`);
                });
            console.log("ouverture avec " + response);
        }
    }

    const openQuickSearch = () => {
        let tableNumberSearched;
        Modal.confirm({
            title: 'Quick Search',
            content: <div>
                <Title level={5}>Enter the table number</Title>
                <InputNumber autoFocus={true} min={0} onChange={(newValue) => tableNumberSearched = newValue}
                             value={tableNumberSearched}/>
            </div>, okText: 'Access', cancelText: 'Cancel',
            onOk: () => {
                const tableSearched = tables.find(table => table.tableNumber === tableNumberSearched);
                if (tableSearched !== undefined) handleOnClick(tableSearched);
                else {
                    Modal.error({
                        title: 'Research error',
                        content: `Table ${tableNumberSearched ?? ''} not found`,
                        okText: 'Ok'
                    })
                }
            }
        });
    }

    return (
        <Box sx={{marginInline: "2em"}}>
            <FloatButton shape="square" type="primary" onClick={openQuickSearch} style={{right: 24}}
                         icon={<SearchOutlined/>}/>

            <Grid container spacing={4} style={{paddingBlock: 30}}>
                {tables.map((table) => (
                    <Grid item xs={6} sm={3} key={table.tableNumber}>
                        <TableButton onClick={() => handleOnClick(table)} tableNumber={table.tableNumber}
                                     state={table.state}/>
                    </Grid>
                ))}
            </Grid>

            {/*Pour afficher des messages*/}
            {contextHolder}
        </Box>
    );
}

ChooseTablePage.propTypes = {
    contextHolder: PropTypes.any,
    messageApi: PropTypes.any
}

export default ChooseTablePage;