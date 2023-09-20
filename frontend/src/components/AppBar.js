import React from "react";
import {useLocation} from "react-router-dom";
import {Box, Grid, Stack} from "@mui/material";
import {Divider, Layout, Typography} from "antd";

const {Title} = Typography;

const AppBar = () => {
    const location = useLocation();
    const tableId = location.pathname.split("/takeOrder/")[1];

    return (
        <div>
            <Box sx={{width: '100%'}}>
                <Grid container alignItems="center" style={{marginTop: 15}}>
                    <Grid item xs={7}>
                        <Title style={{marginTop: 0}} level={3}>
                            {location.pathname === "/" ? "Table selection" : "Order"}
                        </Title>
                    </Grid>
                    <Grid item xs={5}>
                        {location.pathname.includes("/takeOrder") ? (
                            <Title style={{marginTop: 0, textAlign: "right"}} level={5}>Table n°{tableId}</Title>) : ''}
                    </Grid>
                </Grid>
                <Divider style={{margin: 0}}/>
            </Box>
            <Divider style={{margin: 0}}/>
        </div>
    );
};

export default AppBar;
