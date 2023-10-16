import React from "react";
import { Grid, Paper, TextField, Box } from "@mui/material";
import { Typography } from "antd";

const { Title } = Typography;

const DishDisplayTable = ({
  menuItems,
  setMenuItemsFunc,
  currDisplayingItems,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{ margin: "10px", height: "430px", overflow: "auto" }}
    >
      <Grid container spacing={0.5} padding={1}>
        {currDisplayingItems.length !== 0 &&
          currDisplayingItems.map((menuItem, index) => (
            <Grid item xs={6} key={index}>
              <Paper
                className="menu-item"
                elevation={0}
                sx={{
                  height: 160,
                  borderRight: "solid 1px rgba(0,0,0,0.2)",
                  borderBottom: "solid 1px rgba(0,0,0,0.2)",
                  borderRadius: "0px",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  marginBottom="10px"
                  marginLeft={1}
                  marginRight={1}
                >
                  <img
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                    }}
                    src={menuItem.image}
                  ></img>
                  <Typography variant="h6">
                    {
                      <Title style={{ margin: 0 }} level={4}>
                        {menuItem.shortName.charAt(0).toUpperCase() +
                          menuItem.shortName.slice(1)}
                      </Title>
                    }
                  </Typography>
                  <Typography>
                    {
                      <Title style={{ margin: 0 }} level={4}>
                        {menuItem.price} €
                      </Title>
                    }
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
};

export default DishDisplayTable;
