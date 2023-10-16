import React from "react";
import PaperButtonMUI from "../templates/PaperButtonMUI";
import { Grid,alpha } from "@mui/material";

const CategoryButtons = ({ functionOnClick, selected, displayGrid }) => {

  const borderRadiusDrinks = {
    bl: "15px",
    br: "0px",
    tl: "0px",
    tr: "0px",
  };

  const borderRadiusStarter = {
    bl: "0px",
    br: "0px",
    tl: "15px",
    tr: "0px",
  };

  const borderRadiusDessert = {
    bl: "0px",
    br: "15px",
    tl: "0px",
    tr: "0px",
  };

  const borderRadiusDish = {
    bl: "0px",
    br: "0px",
    tl: "0px",
    tr: "15px",
  };

  return (
    <div style={{marginTop: "10px"}}>
      <Grid
        container
        spacing={1}
        justifyContent="center"
        paddingTop="10px !important"
      >
        <Grid item xs={5}>
          <PaperButtonMUI
            borderRadius={borderRadiusStarter}
            title={"Starter"}
            color={selected === "Starter" && displayGrid ? alpha("#F9D9C9",1) : alpha("#F9D9C9",0.6) }
            elevation={selected === "Starter" && displayGrid ? 2 : 0}
            onClick={functionOnClick}
          ></PaperButtonMUI>
        </Grid>
        <Grid item xs={5}>
          <PaperButtonMUI
            borderRadius={borderRadiusDish}
            title={"Main dish"}
            color={selected === "Main dish" && displayGrid ? alpha("#DDD6FC",1) : alpha("#DDD6FC",0.6) }
            elevation={selected === "Main dish" && displayGrid ? 2 : 0}
            onClick={functionOnClick}
          ></PaperButtonMUI>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={1}
        justifyContent="center"
        paddingTop="10px !important"
      >
        <Grid item xs={5}>
          <PaperButtonMUI
            title={"Drinks"}
            color={selected === "Drinks" && displayGrid ? alpha("#C5FBF0",1) : alpha("#C5FBF0",0.6) }
            elevation={selected === "Drinks" && displayGrid ? 2 : 0}
            borderRadius={borderRadiusDrinks}
            onClick={functionOnClick}
          ></PaperButtonMUI>
        </Grid>
        <Grid item xs={5}>
          <PaperButtonMUI
            borderRadius={borderRadiusDessert}
            title={"Dessert"}
            color={selected === "Dessert" && displayGrid ? alpha("#D1E3F4",1) : alpha("#D1E3F4",0.6) }
            elevation={selected === "Dessert" && displayGrid ? 2 : 0}
            onClick={functionOnClick}
          ></PaperButtonMUI>
        </Grid>
      </Grid>
    </div>
  );
};

export default CategoryButtons;
