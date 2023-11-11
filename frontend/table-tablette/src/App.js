import {Button, Layout, Modal, notification} from "antd";
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
    TABLE_AVAILABLE, TABLE_BLOCKED,
    TABLE_OPEN
} from "./components/TableStateConstants";
import {PhoneOutlined} from "@ant-design/icons";
import {callWaiter} from "./api/waiter";
import {Backdrop, Paper, Typography} from "@mui/material";
import {ServedPage} from "./pages/ServedPage";
import {TableBlockedPage} from "./pages/TableBlockedPage";

function App() {
    const TABLE_NUMBER = parseInt(localStorage.getItem('tableNumber'));
    const [linkedTable, setLinkedTable] = useState(null);
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const [tableInfos, setTableInfos] = useState(null);
    const [callingWaiter, setCallingWaiter] = useState(false);
    const [outOfService, setOutOfService] = useState(false);
    const [openBillDialog, setOpenBillDialog] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (tableInfos === null) return;

        Modal.destroyAll();

        switch (tableInfos.state) {
            case TABLE_AVAILABLE:
                setLinkedTable(null);
                setOpenBillDialog(false);
                navigate('/');
                break;
            case TABLE_OPEN:
                navigate('/menu');
                break;
            case READY_TO_SERVE:
            case PREPARATION_IN_PROGRESS:
                navigate('/preparation');
                break;
            case TABLE_BLOCKED:
                navigate('/blocked');
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

        let numOfTheLinkedTable = null;

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
            const tableNumberReceive = parseInt(res.tableNumber);
            if (tableNumberReceive === TABLE_NUMBER || tableNumberReceive === numOfTheLinkedTable) {
                const linkedTable = res.linkedTableNumber;
                if (linkedTable) {
                    numOfTheLinkedTable = linkedTable;
                    setLinkedTable(linkedTable);
                    setTableInfos(res.linkedTableState);
                } else setTableInfos(res);
            }
        });

        newSocket.on('LinkTable', (res) => {
            const tableSource = res.tableSource;
            const allLinkedTable = res.allLinkedTable;
            if (allLinkedTable.includes(TABLE_NUMBER)) {
                setLinkedTable(tableSource);
                numOfTheLinkedTable = tableSource;
            }
        });

        newSocket.on('UnlinkTable', (res) => {
            console.log(res);
            if (res.tableSourceToUnlink === numOfTheLinkedTable) {
                setLinkedTable(null);
                numOfTheLinkedTable = null;
                window.location.reload();
            }
        })

        newSocket.on('OpenRecapBasket', (res) => {
            const pathname = window.location.pathname;
            const tableNumber = parseInt(res.tableNumber);
            const basket = res.basket;
            if ((tableNumber === TABLE_NUMBER || tableNumber === numOfTheLinkedTable) && pathname !== "/menu") {
                navigate('/menu', {state: {basket}});
            }
        });

        newSocket.on('OpenBill', (res) => {
            const tableNumber = parseInt(res.tableNumber);
            if (tableNumber === TABLE_NUMBER || tableNumber === numOfTheLinkedTable) setOpenBillDialog(true);
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

                <TopAppBar linkedTable={linkedTable} tableNumber={TABLE_NUMBER}/>
            </Header>
            <Content style={contentStyle}>
                <Routes>
                    <Route path="/" element={<WelcomingPage/>}/>
                    <Route path="/preparation" element={<PreparationInProgressPage tableInfos={tableInfos}/>}/>
                    <Route path="/menu" element={<MenuDisplayingPage tableInfos={tableInfos}/>}></Route>
                    <Route path="/blocked" element={<TableBlockedPage/>}></Route>
                    <Route path="/served" element={<ServedPage tableInfos={tableInfos} callWaiter={callWaiter} linkedTable={linkedTable}
                                                               openTheBill={openBillDialog} setOpenBillDialog={setOpenBillDialog}/>}></Route>
                </Routes>
            </Content>
        </Layout>
    );
}

export default App;
