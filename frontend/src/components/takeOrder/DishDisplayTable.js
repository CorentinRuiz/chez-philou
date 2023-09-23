import React, { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Paper,
  TextField,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { openAddCommentModal } from "../chooseTable/ModalDisplay";

const DishDisplayTable = ({ menuItems }) => {
  const [itemCounts, setItemCounts] = useState(menuItems.map(() => 0));

  const handleAddItem = (index) => {
    const newCounts = [...itemCounts];
    newCounts[index] += 1;
    setItemCounts(newCounts);
  };

  const handleRemoveItem = (index) => {
    if (itemCounts[index] > 0) {
      const newCounts = [...itemCounts];
      newCounts[index] -= 1;
      setItemCounts(newCounts);
    }
  };

  const handleItemCountChange = (index, newValue) => {
    const newCounts = [...itemCounts];
    newCounts[index] = newValue;
    setItemCounts(newCounts);
  };

  return (
    <Paper elevation={1} sx={{margin: "10px"}}>
      <Grid container spacing={0.5} padding={1}>
        {menuItems.map((menuItem, index) => (
          <Grid item xs={6} key={index}>
            <Paper
              className="menu-item"
              elevation={0}
              sx={{ height: 100, }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginBottom="10px"
                marginLeft={1}
                marginRight={1}
              >
                <Typography variant="h6">{menuItem.title}</Typography>
                <IconButton onClick={openAddCommentModal}>
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
                    onClick={() => handleRemoveItem(index)}
                    disabled={itemCounts[index] === 0}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <TextField
                    type="number"
                    variant="outlined"
                    value={itemCounts[index]}
                    onChange={(e) =>
                      handleItemCountChange(index, parseInt(e.target.value, 10))
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
                    onClick={() => handleAddItem(index)}
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
