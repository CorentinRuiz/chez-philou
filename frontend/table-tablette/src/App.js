import {Layout} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import {Routes, Route} from "react-router-dom";
import {TopAppBar} from "./TopAppBar";

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
                <TopAppBar/>
            </Header>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Content style={contentStyle}>
                            Accueil
                        </Content>
                    }
                />
            </Routes>
        </Layout>
    );
}

export default App;
