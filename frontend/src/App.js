import ChooseTablePage from "./pages/ChooseTablePage";
import {Content, Header} from "antd/es/layout/layout";
import {Box} from "@mui/material";
import {Divider, Layout, Typography} from "antd";
import React from "react";
const {Title} = Typography;

function App() {
  const headerStyle: React.CSSProperties = {
    textAlign: 'left',
    color: '#000000',
    paddingInline: 20,
    backgroundColor: '#FFFFFF',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
  };

  return (
      <Layout>
        <Header style={headerStyle}>
          <Box sx={{width: '100%'}}>
            <Title style={{marginTop: 15}} level={3}>Table selection</Title>
            <Divider style={{margin: 0}}/>
          </Box>
        </Header>
        <Content style={contentStyle}>
          <ChooseTablePage/>
        </Content>
      </Layout>
  );
}

export default App;
