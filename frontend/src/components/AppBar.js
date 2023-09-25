import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import { Divider, Typography, Button } from "antd";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const { Title } = Typography;

const AppBar = () => {
  const location = useLocation();
  const tableId = location.pathname.split("/takeOrder/")[1];

  const navigate = useNavigate();

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Grid container alignItems="center" style={{ marginTop: 15 }}>
          <Grid item xs={6}>
            <Title style={{ marginTop: 0 }} level={3}>
              {location.pathname === "/" ? "Table selection" : "Order"}
            </Title>
          </Grid>
          <Grid item xs={6}>
            {location.pathname.includes("/takeOrder") ? (
              <Box display="flex" alignItems="center">
                <Title
                  style={{
                    marginTop: 0,
                    textAlign: "right",
                    marginRight: "15px",
                  }}
                  level={5}
                >
                  Table n°{tableId}
                </Title>
                <Button
                  onClick={() => {
                    navigate("/");
                  }}
                  danger
                  style={{ marginBottom: "0.5em" }}
                >
                  <HighlightOffIcon />
                </Button>
              </Box>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <Divider style={{ margin: 0 }} />
      </Box>
      <Divider style={{ margin: 0 }} />
    </div>
  );
};

export default AppBar;
