import {useEffect, useState} from "react";
import {getTablesNumbers} from "./api/tables";
import {Button, Select, Typography} from "antd";
import {Stack} from "@mui/material";

export const MustDefinedTableNumber = () => {
    const [allTableNumber, setAllTableNumber] = useState([]);
    const [tableSelected, setTableSelected] = useState(1);

    const {Title} = Typography;

    useEffect(() => {
        getTablesNumbers().then((res) => {
            setAllTableNumber(res.data.map((table) => ({
                value: table.number, label: `Table n°${table.number}`
            })));
        });
    }, []);

    const stateTablette = () => {
        localStorage.setItem('tableNumber', tableSelected.toString());
        window.location.reload();
    }

    const centerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }

    return (
        <Stack direction="column" spacing={5} style={centerStyle}>
            <Title level={1}>Numéro de table non défini</Title>
            <Select options={allTableNumber} style={{width: 200}} value={tableSelected}
                    onChange={(newValue) => setTableSelected(newValue)} size="large"/>
            <Button onClick={stateTablette} style={{width: 200}} type="primary" size="large">Démarrer</Button>
        </Stack>
    )
}