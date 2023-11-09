import {Modal, Select, Typography, Collapse, Button, Divider} from "antd";
import TextArea from "antd/es/input/TextArea";
import {Autocomplete, Checkbox, Grid, IconButton, Stack, TextField} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import React, {useState} from "react";
import {PreparationProgressDisplay} from "./PreparationProgressDisplay";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {TABLE_AVAILABLE, TABLE_BLOCKED, TABLE_LINKED} from "./Constants";
import {createNewOrder} from "../../api/tablesOrders";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import {addLinkedTableToOpenTable} from "../../api/tables";

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
                <Collapse bordered={false} items={orders}/>
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
                <Grid item xs={1}><IconButton aria-label="link" style={{padding: 0}} onClick={() => {
                    Modal.destroyAll();
                    onModalResponse(table, "link");
                }}><InsertLinkIcon/></IconButton></Grid>
                <Grid item xs={1}><IconButton aria-label="lock" style={{padding: 0}} onClick={() => {
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

const GetLinkTableContent = ({currentTable, allTables, resolve, reject}) => {
    const [selectedTables, setSelectedTables] = useState([]);
    const [numberOfPeople, setNumberOfPeople] = useState(1);

    const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
    const checkedIcon = <CheckBoxIcon fontSize="small"/>;

    const GetTableIcon = ({tableState}) => {
        if(tableState === TABLE_BLOCKED) return <LockIcon/>
        else if(tableState === TABLE_LINKED) return <InsertLinkIcon/>
        else if (tableState !== TABLE_AVAILABLE) return <LocalDiningIcon/>
    }

    return <Stack direction="column" spacing={2}>
        <Title level={5}>How many people in total ?</Title>
        <Select
            style={{width: 120}} value={numberOfPeople}
            onChange={(newValue) => setNumberOfPeople(newValue)}
            options={Array.from({length: 20}, (_, i) => ({label: i + 1, value: i + 1}))}/>

        <Divider/>

        <Title level={5}>Select the table you want to link to table n°{currentTable.number} :</Title>
        <Autocomplete value={selectedTables}
                      onChange={(event, newValue) => {
                          setSelectedTables(newValue);
                      }}
                      renderInput={(params) => (
                          <TextField {...params} label="Selected tables" placeholder="Selected tables"/>
                      )} disableCloseOnSelect multiple
                      getOptionLabel={(option) => option.number.toString()}
                      renderOption={(props, table, {selected}) => (
                          <li {...props}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                  <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected}/>
                                  Table n°{table.number}
                                  <GetTableIcon tableState={table.state}/>
                              </Stack>
                          </li>
                      )}
                      getOptionDisabled={(table) => table.state === TABLE_BLOCKED || table.state === TABLE_LINKED
                          || (selectedTables.filter(table => table.state !== TABLE_AVAILABLE).length !== 0 && selectedTables[0].number !== table.number)
                          || (selectedTables.length > 0 && table.state !== TABLE_AVAILABLE && selectedTables[0].number !== table.number)}
                      options={allTables.filter((table) => table.number !== currentTable.number)}/>

        <Divider/>

        <Button type="primary" disabled={selectedTables.length === 0}
                onClick={() => linkTables(currentTable, selectedTables, numberOfPeople, resolve, reject)}>
            Link Tables
        </Button>
    </Stack>
}

const linkTables = (currentTable, linkedTables, numberOfPeople, resolve, reject) => {
    // On veut rajouter la table courante à une table déjà occupée
    if (linkedTables.length === 1 && linkedTables[0].state !== TABLE_AVAILABLE) {
        addLinkedTableToOpenTable(currentTable.number, linkedTables[0].number, numberOfPeople)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
            .finally(() => {
                Modal.destroyAll();
            })
    }

    // On veut créer une nouvelle commande avec plusieurs tables
    else {
        createNewOrder(currentTable.number, numberOfPeople, linkedTables.map((table) => table.number))
            .then(() => {
                resolve(currentTable.number);
            })
            .catch((err) => {
                reject(err);
            })
            .finally(() => {
                Modal.destroyAll();
            })
    }
}

export const linkTableModal = (currentTable, allTables) => {
    return new Promise((resolve, reject) => {
        Modal.info({
            title: "Link table",
            content: <GetLinkTableContent currentTable={currentTable} allTables={allTables} resolve={resolve}
                                          reject={reject}/>,
            okText: "Cancel",
            onOk: () => reject(),
            okType: "danger"
        });
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