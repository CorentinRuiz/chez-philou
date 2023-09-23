import React, { useState } from "react";
import { Divider } from "@mui/material";
import CategoryButtons from "../components/takeOrder/CategoryButtons";
import DishDisplayTable from "../components/takeOrder/DishDisplayTable";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import BottomSheetHeader from "../components/takeOrder/bottomSheet/BottomSheetHeader";
import OrderItem from "../components/takeOrder/bottomSheet/OrderItem";

const TakeOrderPage = () => {
  const [lastButtonClicked, setLastButtonClicked] = useState("");
  const [displayGrid, setDisplayGrid] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const getNewItems = (e) => {
    setDisplayGrid(
      lastButtonClicked === e.target.innerText ? !displayGrid : true
    );
    setLastButtonClicked(e.target.innerText);
    setMenuItems([
      { title: "Plat 1" },
      { title: "Plat 2" },
      { title: "Plat 3" },
    ]);
  };

  const fakeItems = {
    name: "Salade César",
    quantity: 1,
    price: 5,
    comment: ""
  }

  return (
    <div>
      <CategoryButtons functionOnClick={getNewItems} />
      <Divider style={{ margin: 20 }} />
      {displayGrid ? <DishDisplayTable menuItems={menuItems} /> : ""}
      <BottomSheet
        open={true}
        blocking={false}
        snapPoints={({ maxHeight }) => [maxHeight / 7, maxHeight * 0.7]}
      >
        <BottomSheetHeader nbItems={5} totalPrice={45.0} />
        <Divider style={{ margin: 20, background: "#D1E3F4" }} />
        <OrderItem color="#F9D9C9" items={fakeItems}></OrderItem>
      </BottomSheet>
    </div>
  );
};

export default TakeOrderPage;
