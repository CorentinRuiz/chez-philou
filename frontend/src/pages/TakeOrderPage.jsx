import React, { useEffect, useState } from "react";
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
  const [currDisplayingItems, setCurrDisplayingItems] = useState([]);
  const [starterItems, setStarterItems] = useState([]);
  const [mainItems, setMainItems] = useState([]);
  const [drinksItems, setDrinksItems] = useState([]);
  const [dessertItems, setDessertItems] = useState([]);
  const [displayContentBottomSheet, setDisplayContentBottomSheet] =
    useState(false);
  const sheetRef = React.useRef();
  const BOTTOM_SHEET_VALUE_CLOSED = 94 || 0;

  const sortMenusItems = () => {
    getMenus().then((res) => {
      for (const item of res.data) {
        switch (item.category) {
          case "MAIN":
            mainItems.push(item);
            break;
          case "DESSERT":
            dessertItems.push(item);
            break;
          case "BEVERAGE":
            drinksItems.push(item);
            break;
          case "STARTER":
            starterItems.push(item);
            break;
        }
      }
    });
  };

  const getNewItems = (e) => {
    setDisplayGrid(
      lastButtonClicked === e.target.innerText ? !displayGrid : true
    );
    setLastButtonClicked(e.target.innerText);

    switch (e.target.innerText.toLowerCase()) {
      case "main dish":
        setCurrDisplayingItems(mainItems);
        break;
      case "dessert":
        setCurrDisplayingItems(dessertItems);
        break;
      case "drinks":
        setCurrDisplayingItems(drinksItems);
        break;
      case "starter":
        setCurrDisplayingItems(starterItems);
        break;
    }
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

  const initialSheetHeight = window.innerHeight / 9; // Point d'ancrage minimal
  const fullSheetHeight = window.innerHeight * 0.7; // Point d'ancrage maximal

  const onBottomSheetOpen = () => {
    setDisplayContentBottomSheet(true);
  };

  const onBottomSheetDrag = async (event) => {
    requestAnimationFrame(() => {
      const height = sheetRef.current.height;
      // Bottom Sheet Open
      if (height > BOTTOM_SHEET_VALUE_CLOSED) onBottomSheetOpen();
      // Bottom Sheet Initial or Open
      else setDisplayContentBottomSheet(false);
    });
  };

  useEffect(() => {
    sortMenusItems();
  }, []);

  return (
    <div>
      <CategoryButtons
        selected={lastButtonClicked}
        functionOnClick={getNewItems}
        displayGrid={displayGrid}
      />
      <Divider style={{ margin: 20 }} />
      {displayGrid ? <DishDisplayTable menuItems={currDisplayingItems} /> : ""}
      <BottomSheet
        onSpringStart={onBottomSheetDrag}
        ref={sheetRef}
        header={<BottomSheetHeader nbItems={5} totalPrice={45.0} />}
        open={true}
        blocking={displayContentBottomSheet}
        snapPoints={({}) => [initialSheetHeight, fullSheetHeight]}
      >
        {/*FIXME si pas d'item, on met un message "pas d'item"*/}
        {fakeItems.map((fakeItem) => (
          <OrderItem
            key={fakeItem.name}
            color={fakeItem.color}
            item={fakeItem}
          ></OrderItem>
        ))}
      </BottomSheet>
    </div>
  );
};

export default TakeOrderPage;
