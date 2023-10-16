import TakeOrderPage from "./pages/TakeOrderPage";
import {Content, Header} from "antd/es/layout/layout";
import {Layout} from "antd";
import React from "react";
import ChooseTablePage from "./pages/ChooseTablePage";
import {Routes, Route} from "react-router-dom";
import AppBar from "./components/AppBar";

function App() {
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

    return (
        <Layout>
            <Header style={headerStyle}>
                <AppBar/>
            </Header>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Content style={contentStyle}>
                            <ChooseTablePage/>
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
