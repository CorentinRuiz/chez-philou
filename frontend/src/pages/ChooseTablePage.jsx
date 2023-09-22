import React, {useEffect, useState} from 'react'
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
import {Alert, FloatButton, InputNumber, message, Modal, Typography} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {getAllTables} from "../api/tables";
import {wait} from "@testing-library/user-event/dist/utils";

const {Title} = Typography;

const ChooseTablePage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [allTables, setAllTables] = useState([]);
    const [firstLoadInProgress, setFirstLoadInProgress] = useState(true);

    const navigate = useNavigate();

    const handleOnClick = (table) => {
        openModalDisplay(table, handleModalResponse);
    }

    const handleModalResponse = (table, response) => {
        // Débloquer une table
        if (table.state === TABLE_BLOCKED && response === true) {
            messageApi.loading(`Unlocking table ${table.number}...`, 2.5)
                .then(() => messageApi.success(`Table ${table.number} unlocked`));
            console.log("débloquer");
        }

        // Délivrer
        else if (table.state === READY_TO_SERVE && response === true) {
            messageApi.success(`Table ${table.number} delivered`);
            console.log("livrer");
        }

        // Ouverture nouvelle table
        else if (table.state === TABLE_AVAILABLE) {
            messageApi.loading(`Opening of table ${table.number} in progress`, 2)
                .then(() => {
                    navigate(`/takeOrder/${table.number}`);
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
                const tableSearched = allTables.find(table => table.number === tableNumberSearched);
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

    const retrieveTables = () => {
        getAllTables().then((response) => {
            setAllTables(response.data.map((table) => {
                return {
                    id: table._id,
                    number: table.number,
                    state: table.taken ? '' : TABLE_AVAILABLE
                }
            }))
            messageApi.destroy();
            messageApi.success('Tables retrieved');
        }).catch(() => {
            messageApi.error('Unable to retrieve information from the table management service').then(() => {
                messageApi.loading(
                    'Retrying to retrieve tables in 5 seconds',
                    5,
                    () => retrieveTables()
                )
            });
        })
            .finally(() => setFirstLoadInProgress(false));
    }

    useEffect(() => {
        retrieveTables();
    }, []);

    const DisplayTableSelection = () => {
        if (firstLoadInProgress)
            return <Grid item xs={12} sm={3} key={1}><Alert message="Loading"
                                                            description="Loading table data in progress. Please wait..."
                                                            type="warning" showIcon/></Grid>
        else if (allTables.length === 0)
            return <Grid item xs={12} sm={3} key={1}><Alert message="Error"
                                                            description="Unable to retrieve information from the table management service..."
                                                            type="error" showIcon/></Grid>
        else {
            return allTables.map((table) => (
                <Grid item xs={6} sm={3} key={table.number}>
                    <TableButton onClick={() => handleOnClick(table)} tableNumber={table.number}
                                 state={table.state}/>
                </Grid>
            ));
        }
    }

    return (
        <Box sx={{marginInline: "2em"}}>
            <FloatButton shape="square" type="primary" onClick={openQuickSearch} style={{right: 24}}
                         icon={<SearchOutlined/>}/>

            <Grid container spacing={4} style={{paddingBlock: 30}}>
                <DisplayTableSelection/>
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