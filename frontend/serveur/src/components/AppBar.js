import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Box, Grid, Stack} from "@mui/material";
import {Divider, Typography, Button} from "antd";
import {HomeOutlined} from "@ant-design/icons";

const {Title} = Typography;

const AppBar = () => {
    const location = useLocation();
    const tableId = location.pathname.split("/takeOrder/")[1];

    const navigate = useNavigate();

    const goBackToChooseTablePage = () => {
        navigate("/");
    }

    const DisplayMoreOptions = () => {
        if (location.pathname.includes("/takeOrder")) {
            return (<>
                <Title style={{textAlign: "right"}} level={5}>
                    Table n°{tableId}
                </Title>
                <Button type="primary" onClick={goBackToChooseTablePage} shape="circle" icon={<HomeOutlined/>}/>
            </>);
        } else {
            return ("");
        }
    }

    return (
        <div>
            <Box sx={{width: "100%"}}>
                <Grid container alignItems="center" style={{marginTop: 15, paddingBottom: 10}}>
                    <Grid item xs={6}>
                        <Title style={{margin: 0}} level={3}>
                            {location.pathname === "/" ? "Table selection" : "Order"}
                        </Title>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack direction="row" alignItems="center" spacing={2} justifyContent="flex-end">
                            <DisplayMoreOptions/>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider style={{margin: 0}}/>
            </Box>
        </div>
    );
};

export default AppBar;
