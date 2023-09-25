import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Box, Grid, Stack} from "@mui/material";
import {Divider, Typography, Button} from "antd";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const {Title} = Typography;

const AppBar = () => {
    const location = useLocation();
    const tableId = location.pathname.split("/takeOrder/")[1];

    const navigate = useNavigate();

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
                        {location.pathname.includes("/takeOrder") ? (
                            <Stack direction="row" alignItems="center" spacing={2} justifyContent="flex-end">
                                <Title style={{textAlign: "right"}} level={5}>
                                    Table n°{tableId}
                                </Title>
                                <Button onClick={() => navigate("/")} danger>
                                    <HighlightOffIcon/>
                                </Button>
                            </Stack>
                        ) : (
                            ""
                        )}
                    </Grid>
                </Grid>
                <Divider style={{margin: 0}}/>
            </Box>
        </div>
    );
};

export default AppBar;
