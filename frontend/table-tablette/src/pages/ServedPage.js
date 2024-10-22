import {Chip, Paper, Stack, Typography} from "@mui/material";
import {Button, Modal, Table} from "antd";
import {useNavigate} from "react-router-dom";
import {EuroCircleOutlined, BookOutlined, EuroOutlined} from "@ant-design/icons";
import {getPastOrders} from "../api/orders";
import {useEffect} from "react";

export const ServedPage = ({tableInfos, callWaiter, openTheBill, setOpenBillDialog, linkedTable}) => {
    const navigate = useNavigate();

    const messageDisplayStyle = {
        position: "absolute",
        backgroundColor: "rgba(255,255,255,0.8)",
        width: '65%',
        paddingBlock: '65px',
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
            <Stack direction="column">
                <Typography variant="body" textAlign="right">
                    Nombre de produits : {itemsGrouped.reduce((acc, item) => acc + item.quantity, 0)}
                </Typography>
                <Typography variant="h6" textAlign="right"><b>Total
                    : {itemsGrouped.reduce((acc, item) => acc + item.unitaryPrice * item.quantity, 0)}€</b></Typography>
            </Stack>
        )}/>
    }

    const displayBill = async () => {
        const tableOrderId = tableInfos.tableOrderInfos._id;
        const tableNumber = tableInfos.tableNumber;

        Modal.confirm({
            title: `Addition${linkedTable ? ` (liée à la table n°${linkedTable})` : ''}`,
            content: await displayBillContent(tableOrderId),
            okText: "Appeler le serveur",
            cancelText: "Fermer",
            onOk: () => callWaiter(tableNumber),
            onCancel: () => {
                setOpenBillDialog(false);
            },
            icon: <EuroCircleOutlined/>,
            width: '80%'
        });
    }

    return (
        <Stack style={textInFrontStyle} alignItems="center" justifyContent="center" id="gradient-animation-served">
            <Paper elevation={10} style={messageDisplayStyle}>
                <Stack spacing={10}>
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