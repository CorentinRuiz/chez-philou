import {Paper, Stack, Typography} from "@mui/material";
import {Button, Modal, Table} from "antd";
import {useNavigate} from "react-router-dom";
import {EuroCircleOutlined} from "@ant-design/icons";

export const ServedPage = ({tableInfos, callWaiter}) => {
    const navigate = useNavigate();

    const messageDisplayStyle = {
        width: '70%',
        paddingInline: '30px',
        paddingBlock: '60px',
    }

    const textInFrontStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        textAlign: 'center'
    }

    const billColumns = [
        { title: "Nom", dataIndex: "name", key: "name" },
        { title: "Quantité", dataIndex: "quantity", key: "quantity", render: (quantity) => `x${quantity}` },
        { title: "Prix", dataIndex: "price", key: "price", render: (price) => `${price}€` },
    ]

    const displayBillContent = (lines) => {
        const allItems = lines
            .map(line => ({quantity: line.howMany, name: line.item.shortName, id: line.item._id, price: '?', key: line.item._id}));

        let itemsGrouped = [];
        allItems.forEach(itemA => {
            const itemG = itemsGrouped.find((itemG) => itemG.name === itemA.name);
            if (itemG) itemG.quantity += itemA.quantity;
            else itemsGrouped.push(itemA);
        })

        return <Table columns={billColumns} dataSource={itemsGrouped} pagination={false}/>
    }

    const displayBill = () => {
        const lines = tableInfos.tableOrderInfos.lines;
        const tableNumber = tableInfos.tableNumber;

        Modal.confirm({
            title: "Addition",
            content: displayBillContent(lines),
            okText: "Appeler le serveur",
            cancelText: "Fermer",
            onOk: () => callWaiter(tableNumber),
            icon: <EuroCircleOutlined/>,
        });
    }

    return (
        <Stack style={textInFrontStyle} alignItems="center" justifyContent="center">
            <Paper elevation={0} style={messageDisplayStyle} id="paper-gradient-animation-served">
                <Stack spacing={5}>
                    <Typography variant="h2">Bon appétit !</Typography>
                    <Stack spacing={5} alignItems="center" justifyContent="center" direction="row">
                        <Button type="primary" shape="round" size="large"
                                onClick={() => navigate('/menu', {state: {from: '/served'}})}>Afficher le menu</Button>
                        <Button type="default" shape="round" size="large" onClick={displayBill}>Afficher
                            l'addition</Button>
                        {/*TODO permettre d'afficher l'addition*/}
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    )
}