import React from "react";
import { Grid, IconButton, Paper, TextField, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { openAddCommentModal } from "../chooseTable/ModalDisplay";
import { Typography } from "antd";

const { Title } = Typography;

const DishDisplayTable = ({
  menuItems,
  setMenuItemsFunc,
  currDisplayingItems,
  addCommentFunc,
}) => {
  const displayAddCommentModal = (menuItem) => {
    openAddCommentModal(menuItem, addCommentFunc);
  };

  const changeQuantity = (menuItem, quantity) => {
    const newMenuItems = [...menuItems];
    const index = newMenuItems.findIndex(item => item._id === menuItem._id);
    newMenuItems[index].quantity = parseInt(quantity, 10) || 0;
    setMenuItemsFunc(newMenuItems);
  };

  return (
    <Paper
      elevation={1}
      sx={{ margin: "10px", height: "430px", overflow: "auto" }}
    >
      <Grid container spacing={0.5} padding={1}>
        {currDisplayingItems.length !== 0 &&
          currDisplayingItems.map((menuItem, index) => (
            <Grid item xs={6} key={index}>
              <Paper className="menu-item" elevation={0} sx={{ height: 100 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom="10px"
                  marginLeft={1}
                  marginRight={1}
                >
                  <Typography variant="h6">
                    {
                      <Title style={{ margin: 0 }} level={4}>
                        {menuItem.shortName.charAt(0).toUpperCase() +
                          menuItem.shortName.slice(1)}
                      </Title>
                    }
                  </Typography>
                  <IconButton
                    onClick={() => {
                      displayAddCommentModal(menuItem);
                    }}
                  >
                    <AddCommentIcon />
                  </IconButton>
                </Box>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={0}
                >
                  <Grid item>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        changeQuantity(menuItem, menuItem.quantity - 1)
                      }
                      disabled={menuItem.quantity === 0}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <TextField
                      type="number"
                      variant="outlined"
                      value={menuItem.quantity}
                      onChange={(e) =>
                        changeQuantity(menuItem, e.target.value) // || 0 To avoid NaN Error
                      }
                      inputProps={{
                        style: {
                          textAlign: "center",
                          padding: "6px 12px",
                          width: "40px",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        changeQuantity(menuItem, menuItem.quantity + 1)
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
};

export default DishDisplayTable;
