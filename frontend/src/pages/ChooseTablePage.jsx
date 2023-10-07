import React, {useEffect, useState} from 'react'
import {Box, Grid} from "@mui/material";
import PropTypes from "prop-types";
import TableButton from "../components/chooseTable/TableButton";
import {
    READY_TO_SERVE,
    TABLE_AVAILABLE,
    TABLE_BLOCKED,
} from "../components/chooseTable/Constants";
import {Alert, FloatButton, InputNumber, message, Modal, Skeleton, Typography} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {getAllTables, updateTable} from "../api/tables";
import {createNewOrder} from "../api/tablesOrders";
import handleClickOnTableItem from "../components/chooseTable/ClickOnTableItem";
import {preparationTakenToTable} from "../api/preparations";

const {Title} = Typography;

const ChooseTablePage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [allTables, setAllTables] = useState([]);
    const [firstLoadInProgress, setFirstLoadInProgress] = useState(true);

    const navigate = useNavigate();

    // Prévoit le clic long pour bloquer
    useEffect(() => {
        allTables.forEach((table) => {
            document.getElementById(`table${table.number}`).addEventListener("contextmenu", (event) => {
                // Désactiver le menu du clic droit
                event.preventDefault();

                // Elle ne doit pas déjà être bloquée
                if (parseInt(table.state) === TABLE_BLOCKED) messageApi.info(`Table ${table.number} already locked`)
                else handleClickOnTableItem(table, handleTableClickResponse, true);
            });
        })
    }, [allTables]);

    const handleOnClick = (table) => {
        handleClickOnTableItem(table, handleTableClickResponse)
    }

    const handleTableClickResponse = (table, response) => {
        // Réouvrir la table déjà ouverte
        if (response === "reopen") {
            navigate(`/takeOrder/${table.number}`);
        }
        // Bloquer une table
        if (response === "lock") {
            updateTable(table.number, {blocked: true})
                .then(() => {
                    messageApi.success(`Table ${table.number} locked`);
                    retrieveTables(false);
                })
                .catch(() => {
                    messageApi.error(`Unable to lock table ${table.number}`);
                })
        }

        // Débloquer une table
        else if (table.state === TABLE_BLOCKED && response === true) {
            updateTable(table.number, {blocked: false})
                .then(() => {
                    messageApi.success(`Table ${table.number} unlocked`);
                    retrieveTables(false);
                })
                .catch(() => {
                    messageApi.error(`Unable to unlock table ${table.number}`);
                })
        }

        // Délivrer
        else if (table.state === READY_TO_SERVE && response === true) {
            const preparationToServeId = getPreparationNotTakenForService(table.tableOrderInfos.preparations)[0]._id;
            preparationTakenToTable(preparationToServeId)
                .then(() => {
                    messageApi.success(`Table ${table.number} delivered`);
                    retrieveTables(false);
                })
                .catch((err) => {
                    console.log(err);
                    messageApi.error(`Unable to deliver table ${table.number}`);
                })
        }

        // Ouverture nouvelle table
        else if (table.state === TABLE_AVAILABLE) {
            openingTable(table, response)
                .then(() => {
                    navigate(`/takeOrder/${table.number}`);
                })
                .catch(() => {
                    messageApi.error(`Unable to open table ${table.number}`);
                });
        }
    }

    const getPreparationNotTakenForService = (tablePreparations) => {
        return tablePreparations.filter(preparation => preparation.takenForServiceAt == null);
    }

    const openingTable = async (table, numberOfPerson) => {
        await createNewOrder(table.number, numberOfPerson);
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

    const retrieveTables = (withMessageApi = true) => {
        getAllTables()
            .then(async (response) => {
                setAllTables(response.data);

                if (withMessageApi) messageApi.success('Tables retrieved');
            })
            .catch((err) => {
                console.log(err);
                messageApi.error('Unable to retrieve information from the table management service').then(() => {
                    messageApi.loading(
                        'Retrying to retrieve tables in 5 seconds',
                        5,
                        () => retrieveTables()
                    );
                });
            })
            .finally(() => setFirstLoadInProgress(false));
    };


    useEffect(() => {
        retrieveTables();
    }, []);

    const DisplayTableSelection = () => {
        if (firstLoadInProgress)
            return <Grid item xs={12} sm={3} key={1}>
                <Alert message="Loading"
                       description="Loading table data in progress. Please wait..."
                       type="warning" showIcon/>
                <Skeleton active/>
            </Grid>
        else if (allTables.length === 0)
            return <Grid item xs={12} key={1}><Alert message="Error"
                                                     description="There is no table, or we are unable to retrieve information from the table management service..."
                                                     type="error" showIcon/></Grid>
        else {
            return allTables.map((table) => (
                <Grid item xs={6} sm={3} key={table.number} id={`table${table.number}`}>
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