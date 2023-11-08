import {Chip, Grid, Paper, Stack, Typography} from "@mui/material";
import {Button, Modal, Table} from "antd";
import {useNavigate} from "react-router-dom";
import {EuroCircleOutlined, BookOutlined, EuroOutlined} from "@ant-design/icons";
import {getPastOrders} from "../api/orders";
import {useEffect} from "react";

export const ServedPage = ({tableInfos, callWaiter, openTheBill}) => {
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

    useEffect(() => {
        if(openTheBill) displayBill();
    }, [openTheBill]);

    const billColumns = [
        {title: "Nom", dataIndex: "name", key: "name"},
        {title: "Catégorie", dataIndex: "category", key: "category", render: (category) => (<Chip style={{backgroundColor: category.color}} label={category.name}/>)},
        {title: "Quantité", dataIndex: "quantity", key: "quantity", render: (quantity) => `x${quantity}`},
        {title: "Prix", dataIndex: "price", key: "price"},
    ]

    const displayBillContent = async (tableOrderId) => {
        const pastOrders = (await getPastOrders(tableOrderId)).data;

        const allItems = [];
        pastOrders.forEach(type => {
            type.preparedItems.forEach(item => allItems.push({
                quantity: item.quantity,
                category: {name: type.name, color: type.color},
                name: item.shortName,
                unitaryPrice: item.price,
                key: item._id,
            }))
        });

        const getPriceDisplayOfLine = (item) => {
            return (
                <Stack spacing={0} direction="column">
                    <Typography variant="body">{item.quantity * item.unitaryPrice}€</Typography>
                    {item.quantity > 1 && (
                        <Typography variant="caption">{item.unitaryPrice}€ x{item.quantity}</Typography>
                    )}
                </Stack>
            )
        }

        let itemsGrouped = [];
        allItems.forEach(itemA => {
            const itemG = itemsGrouped.find((itemG) => itemG.name === itemA.name);
            if (itemG) {
                itemG.quantity += itemA.quantity;
                itemG.price = getPriceDisplayOfLine(itemG)
            } else itemsGrouped.push({
                ...itemA,
                price: getPriceDisplayOfLine(itemA)
            });
        });

        return <Table columns={billColumns} dataSource={itemsGrouped} pagination={false} footer={() => (
            <Grid direction="row" container>
                <Grid item xs={6} textAlign="left"><Typography variant="h6"><b>Total :</b></Typography></Grid>
                <Grid item xs={6} textAlign="right"><Typography
                    variant="h6"><b>{itemsGrouped.reduce((acc, item) => acc + item.unitaryPrice * item.quantity, 0)}€</b></Typography></Grid>
            </Grid>
        )}/>
    }

    const displayBill = async () => {
        const tableOrderId = tableInfos.tableOrderInfos._id;
        const tableNumber = tableInfos.tableNumber;

        Modal.confirm({
            title: "Addition",
            content: await displayBillContent(tableOrderId),
            okText: "Appeler le serveur",
            cancelText: "Fermer",
            onOk: () => callWaiter(tableNumber),
            icon: <EuroCircleOutlined/>,
            width: '80%'
        });
    }

    return (
        <Stack style={textInFrontStyle} alignItems="center" justifyContent="center">
            <Paper elevation={0} style={messageDisplayStyle} id="paper-gradient-animation-served">
                <Stack spacing={5}>
                    <Typography variant="h2">Bon appétit !</Typography>
                    <Stack spacing={5} alignItems="center" justifyContent="center" direction="row">
                        <Button type="primary" shape="round" size="large" icon={<BookOutlined />}
                                onClick={() => navigate('/menu', {state: {from: '/served'}})}>Afficher le menu</Button>
                        <Button type="default" shape="round" size="large" onClick={displayBill} icon={<EuroOutlined />}>
                            Afficher l'addition</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack>
    )
}