import TakeOrderPage from "./pages/TakeOrderPage";
import {Content, Header} from "antd/es/layout/layout";
import {Layout, message, Modal, notification} from "antd";
import React, {useEffect, useState} from "react";
import ChooseTablePage from "./pages/ChooseTablePage";
import {Routes, Route} from "react-router-dom";
import AppBar from "./components/AppBar";
import io from 'socket.io-client';

function App() {
    const [notificationApi, notificationContextHolder] = notification.useNotification()
    const [messageApi, messageContextHolder] = message.useMessage();
    const [allTables, setAllTables] = useState([]);

    const headerStyle = {
        textAlign: "left",
        color: "#000000",
        paddingInline: 20,
        backgroundColor: "#FFFFFF",
        position: "sticky",
        top: 0,
        zIndex: 1,
    };

    const contentStyle = {
        backgroundColor: "#ffffff",
    };

    // WebSocket connection
    useEffect(() => {
        let wsError = false;

        const newSocket = io(`http://${process.env.REACT_APP_WEBSOCKET_URL}`);

        newSocket.on('connect', () => {
            console.log('Connected to websocket', newSocket.id);
            if (wsError) {
                messageApi.destroy();
                messageApi.info('Auto-update back online');
                wsError = false;
            }
        });

        newSocket.on('TableUpdate', (res) => {
            setAllTables(res);
            messageApi.info('Update detected and applied');
        })

        newSocket.on('OrderReady', (res) => {
            const {tableNumber, allTables} = res;
            setAllTables(allTables);
            notificationApi.info({
                duration: 15,
                message: 'Kitchen notification',
                description: <p>The order table n°<b>{tableNumber}</b> is ready</p>
            })
            Modal.destroyAll();
        })

        newSocket.on('CallWaiter', (tableNumber) => {
            notificationApi.warning({
                duration: 15,
                message: <p>The table n°<b>{tableNumber}</b> need help</p>
            })
        })

        newSocket.on('disconnect', () => {
            console.log('Disconnected from websocket');
            messageApi.warning('Auto-update disabled. Error with WS', 0);
            wsError = true;
        });
    }, []);

    return (
        <Layout>
            {notificationContextHolder}
            <Header style={headerStyle}>
                <AppBar/>
            </Header>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Content style={contentStyle}>
                            <ChooseTablePage allTables={allTables} setAllTables={setAllTables}
                                             messageApi={messageApi} messageContextHolder={messageContextHolder}/>
                        </Content>
                    }
                />
                <Route
                    path="/takeOrder/:tableId"
                    element={
                        <Content style={contentStyle}>
                            <TakeOrderPage/>
                        </Content>
                    }
                />
            </Routes>
        </Layout>
    );
}

export default App;
