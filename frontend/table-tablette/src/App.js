import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { Routes, Route } from "react-router-dom";
import { TopAppBar } from "./components/TopAppBar";
import {PreparationInProgressPage} from "./pages/PreparationInProgressPage";
import MenuDisplayingPage from "./pages/MenuDisplayingPage";

function App() {
    const layoutStyle = {
        height: "100vh",
    }

    const headerStyle = {
        textAlign: "left",
        color: "#000000",
        paddingInline: 20,
        position: "sticky",
        top: 0,
        zIndex: 1,
    };

    const contentStyle = {
        background: "#f7f7f7",
        padding: "0 20px",
    }

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <TopAppBar />
      </Header>
      <Content style={contentStyle}>
        <Routes>
          <Route path="/" element={<p>Accueil</p>} />
          <Route path="/preparation" element={<PreparationInProgressPage />} />
          <Route path="/menu" element={<MenuDisplayingPage />}></Route>
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
