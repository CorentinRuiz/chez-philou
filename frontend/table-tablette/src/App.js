import {Button, Layout, notification, Spin} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import {Routes, Route, useNavigate} from "react-router-dom";
import {TopAppBar} from "./components/TopAppBar";
import {PreparationInProgressPage} from "./pages/PreparationInProgressPage";
import MenuDisplayingPage from "./pages/MenuDisplayingPage";
import {WelcomingPage} from "./pages/WelcomingPage";
import {useEffect, useState} from "react";
import io from 'socket.io-client';
import {
    ANOTHER_SERVICE_READY,
    PREPARATION_IN_PROGRESS,
    READY_TO_SERVE,
    TABLE_AVAILABLE,
    TABLE_OPEN
} from "./components/TableStateConstants";
import {PhoneOutlined} from "@ant-design/icons";
import {callWaiter} from "./api/waiter";
import {Backdrop, Paper, Typography} from "@mui/material";
import {ServedPage} from "./pages/ServedPage";

function App() {
    const TABLE_NUMBER = 2;
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const [tableInfos, setTableInfos] = useState(null);
    const [callingWaiter, setCallingWaiter] = useState(false);
    const [outOfService, setOutOfService] = useState(false);
    const [openBillDialog, setOpenBillDialog] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (tableInfos === null) return;

        switch (tableInfos.state) {
            case TABLE_AVAILABLE:
                navigate('/');
                break;
            case TABLE_OPEN:
                navigate('/menu');
                break;
            case READY_TO_SERVE:
            case PREPARATION_IN_PROGRESS:
                navigate('/preparation');
                break;
            case ANOTHER_SERVICE_READY:
                navigate('/served');
                break;
            default:
                navigate('/');
        }
    }, [tableInfos]);

    // WebSocket connection
    useEffect(() => {
        let wsError = false;

        const newSocket = io(`http://${process.env.REACT_APP_WEBSOCKET_URL}`, {query: {tableNumber: TABLE_NUMBER}});

        newSocket.on('connect', () => {
            console.log('Connected to websocket', newSocket.id);
            if (wsError) {
                setOutOfService(false);
                notificationApi.info({
                    message: 'Connexion rétablie',
                    description: "Tablette de nouveau opérationnelle"
                });
                wsError = false;
            }
        });

        newSocket.on('TableInfos', (res) => {
            if (parseInt(res.tableNumber) === TABLE_NUMBER) setTableInfos(res);
        });

        newSocket.on('OpenRecapBasket', (res) => {
            const pathname = window.location.pathname;
            const tableNumber = res.tableNumber;
            const basket = res.basket;
            if((parseInt(tableNumber) === TABLE_NUMBER) && pathname !== "/menu") {
                navigate('/menu', {state: {basket}});
            }
        });

        newSocket.on('OpenBill', (res) => {
            const tableNumber = res.tableNumber;
            if(parseInt(tableNumber) === TABLE_NUMBER) setOpenBillDialog(true);
        });

        newSocket.on('connect_error', () => {
            if (wsError) return;
            setOutOfService(true);
            wsError = true;
        })

        newSocket.on('disconnect', () => {
            console.log('Disconnected from websocket');
            setOutOfService(true);
            wsError = true;
        });
    }, []);

    const layoutStyle = {
        height: "100vh",
    }

    const headerStyle = {
        textAlign: "left",
        color: "#000000",
        paddingInline: 20,
        position: "sticky",
        top: 0,
        zIndex: 2,
    };

    const contentStyle = {
        background: "#f7f7f7",
        padding: "0 20px",
    }

    const callWaiterButtonStyle = {
        position: "fixed",
        right: 15,
        top: 15,
        zIndex: 100000
    }

    const onCallWaiter = () => {
        setCallingWaiter(true);
        callWaiter(TABLE_NUMBER)
            .then(() => {
                notificationApi.info({
                    message: 'Le serveur est prévenu',
                    description: 'Il devrait arriver sous peu...'
                });
            })
            .finally(() => {
                setCallingWaiter(false);
            });
    }

    const backdropPaperStyle = {
        width: '70%',
        paddingInline: '30px',
        paddingBlock: '60px',
    }

    return (
        <Layout style={layoutStyle}>
            {notificationContextHolder}

            <Backdrop open={outOfService} style={{zIndex: 1000000}}>
                <Paper elevation={0} style={backdropPaperStyle} id="paper-backdrop-error">
                        <Typography textAlign="center" variant="h1">Tablette hors service</Typography>
                </Paper>
            </Backdrop>

            <Header style={headerStyle}>
                <Button style={callWaiterButtonStyle} type="primary" shape="round"
                        icon={<PhoneOutlined/>} onClick={onCallWaiter} loading={callingWaiter}
                        size="middle">Appeler le serveur</Button>

                <TopAppBar tableNumber={tableInfos?.tableNumber ?? <Spin/>}/>
            </Header>
            <Content style={contentStyle}>
                <Routes>
                    <Route path="/" element={<WelcomingPage/>}/>
                    <Route path="/preparation" element={<PreparationInProgressPage tableInfos={tableInfos}/>}/>
                    <Route path="/menu" element={<MenuDisplayingPage tableInfos={tableInfos}/>}></Route>
                    <Route path="/served" element={<ServedPage tableInfos={tableInfos} callWaiter={callWaiter} openTheBill={openBillDialog}/>}></Route>
                </Routes>
            </Content>
        </Layout>
    );
}

export default App;
