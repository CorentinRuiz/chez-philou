import React from "react";
import PaperButtonMUI from "../components/templates/PaperButtonMUI";
import { Grid,Divider } from "@mui/material";

const TakeOrderPage = () => {
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
    <div>
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
            color={"#F9D9C9"}
          ></PaperButtonMUI>
        </Grid>
        <Grid item xs={5}>
          <PaperButtonMUI
            borderRadius={borderRadiusDish}
            title={"Main dish"}
            color={"#DDD6FC"}
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
            color={"#C5FBF0"}
            borderRadius={borderRadiusDrinks}
          ></PaperButtonMUI>
        </Grid>
        <Grid item xs={5}>
          <PaperButtonMUI
            borderRadius={borderRadiusDessert}
            title={"Dessert"}
            color={"#D1E3F4"}
          ></PaperButtonMUI>
        </Grid>
      </Grid>

      <Divider style={{ margin: 20 }} />
    </div>
  );
};

export default TakeOrderPage;
