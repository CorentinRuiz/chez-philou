import {Layout} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import {Routes, Route} from "react-router-dom";
import {TopAppBar} from "./pages/TopAppBar";
import {PreparationInProgress} from "./pages/PreparationInProgress";

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
        background: "#965454",
        padding: "0 20px",
    }

    return (
        <Layout>
            <Header style={headerStyle}>
                <TopAppBar/>
            </Header>
            <Content style={contentStyle}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <p>Accueil</p>
                        }
                    />
                    <Route path="/preparation" element={<PreparationInProgress/>}/>
                </Routes>
            </Content>
        </Layout>
    );
}

export default App;
