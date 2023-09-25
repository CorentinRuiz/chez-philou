import React, { useState } from "react";
import { Divider } from "@mui/material";
import CategoryButtons from "../components/takeOrder/CategoryButtons";
import DishDisplayTable from "../components/takeOrder/DishDisplayTable";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import BottomSheetHeader from "../components/takeOrder/bottomSheet/BottomSheetHeader";
import OrderItem from "../components/takeOrder/bottomSheet/OrderItem";
import { getMenus } from "../api/menus";

const TakeOrderPage = () => {
  const [lastButtonClicked, setLastButtonClicked] = useState("");
  const [displayGrid, setDisplayGrid] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const getNewItems = (e) => {
    setDisplayGrid(
      lastButtonClicked === e.target.innerText ? !displayGrid : true
    );
    setLastButtonClicked(e.target.innerText);

    getMenus().then((res) => {
      const itemsToDisplay = [];
      console.log(res.data);

      for (const item of res.data) {
        if (
          item.category.toLowerCase() ===
          e.target.innerText.toLowerCase().split(" ")[0]
        ) {
          itemsToDisplay.push(item);
        }
        if (e.target.innerText.toLowerCase() === "drinks") {
          if (item.category.toLowerCase() === "beverage") {
            itemsToDisplay.push(item);
          }
        }
      }
      setMenuItems(itemsToDisplay);
    });
  };

  const fakeItems = [
    {
      name: "Salade César",
      quantity: 1,
      price: 5,
      comment: "",
      color: "#F9D9C9",
    },
    {
      name: "Fish & Chips",
      quantity: 2,
      price: 15,
      comment: "Sans sauce tartare ",
      color: "#DDD6FC",
    },
    {
      name: "Burger",
      quantity: 1,
      price: 15,
      comment: "",
      color: "#DDD6FC",
    },
  ];

  return (
    <div>
      <CategoryButtons
        selected={lastButtonClicked}
        functionOnClick={getNewItems}
        displayGrid={displayGrid}
      />
      <Divider style={{ margin: 20 }} />
      {displayGrid ? <DishDisplayTable menuItems={menuItems} /> : ""}
      <BottomSheet
        open={true}
        blocking={false}
        snapPoints={({ maxHeight }) => [maxHeight / 7, maxHeight * 0.7]}
      >
        <BottomSheetHeader nbItems={5} totalPrice={45.0} />
        <Divider style={{ margin: 20, background: "#D1E3F4" }} />
        {fakeItems.map((fakeItem) => (
          <OrderItem color={fakeItem.color} item={fakeItem}></OrderItem>
        ))}
      </BottomSheet>
    </div>
  );
};

export default TakeOrderPage;
