import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { Routes, Route } from "react-router-dom";
import { TopAppBar } from "./components/TopAppBar";
import { PreparationInProgress } from "./pages/PreparationInProgress";
import MenuDisplayingPage from "./pages/MenuDisplayingPage";

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
        <TopAppBar />
      </Header>
      <Content style={contentStyle}>
        <Routes>
          <Route path="/" element={<p>Accueil</p>} />
          <Route path="/preparation" element={<PreparationInProgress />} />
          <Route path="/menu" element={<MenuDisplayingPage />}></Route>
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
