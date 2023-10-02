import React, { useEffect, useState } from "react";
import { Divider, Stack } from "@mui/material";
import CategoryButtons from "../components/takeOrder/CategoryButtons";
import DishDisplayTable from "../components/takeOrder/DishDisplayTable";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import BottomSheetHeader from "../components/takeOrder/bottomSheet/BottomSheetHeader";
import OrderItem from "../components/takeOrder/bottomSheet/OrderItem";
import { getMenus } from "../api/menus";
import { useParams } from "react-router-dom";
import {
  addItemToTableOrder,
  startTableOrderPreparation,
} from "../api/tablesOrders";
import { Alert, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getTableInformation } from "../api/tables";

const TakeOrderPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [tableOrderId, setTableOrderId] = useState("");
  const [lastButtonClicked, setLastButtonClicked] = useState("");
  const [displayGrid, setDisplayGrid] = useState(false);
  const [currDisplayingItems, setCurrDisplayingItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [basket, setBasket] = useState([]);
  const [displayContentBottomSheet, setDisplayContentBottomSheet] =
    useState(false);
  const sheetRef = React.useRef();

  const { tableId } = useParams();

  const BOTTOM_SHEET_VALUE_CLOSED = 94 || 0;

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

  const getColors = (category) => {
    switch (category) {
      case "MAIN":
        return "#DDD6FC";
      case "DESSERT":
        return "#D1E3F4";
      case "BEVERAGE":
        return "#C5FBF0";
      case "STARTER":
        return "#F9D9C9";
      default:
        break;
    }
  };

  const getMenusItems = () => {
    getMenus().then((res) => {
      const menuItems = res.data.map((item) => ({
        ...item,
        quantity: 0,
        color: getColors(item.category),
      }));
      setMenuItems(menuItems);
      setCurrDisplayingItems(menuItems);
    });
  };

  const getNewItems = (e) => {
    setDisplayGrid(
      lastButtonClicked === e.target.innerText ? !displayGrid : true
    );
    setLastButtonClicked(e.target.innerText);

    switch (e.target.innerText.toLowerCase()) {
      case "main dish":
        setCurrDisplayingItems(
          menuItems.filter((item) => item.category === "MAIN")
        );
        break;
      case "dessert":
        setCurrDisplayingItems(
          menuItems.filter((item) => item.category === "DESSERT")
        );
        break;
      case "drinks":
        setCurrDisplayingItems(
          menuItems.filter((item) => item.category === "BEVERAGE")
        );
        break;
      case "starter":
        setCurrDisplayingItems(
          menuItems.filter((item) => item.category === "STARTER")
        );
        break;
      default:
        setCurrDisplayingItems(menuItems);
        break;
    }
  };

  const sendOrder = () => {
    basket.forEach((item) => {
      console.log(item);
      addItemToTableOrder(tableOrderId, item._id, item.shortName, item.quantity);
    });
    startTableOrderPreparation(tableOrderId).then(() => {
        messageApi.success(`Commande bien envoyée à la cuisine`);
    });
  };

  const checkItemInBasket = () => {
    menuItems.forEach((menuItem) => {
      if (menuItem.quantity > 0 && !basket.includes(menuItem)) {
        setBasket([...basket, menuItem]);
      } else if (
        basket.includes(menuItem) &&
        basket[basket.indexOf(menuItem)].quantity !== menuItem.quantity
      ) {
        const newBasket = [...basket];
        newBasket.splice(basket.indexOf(menuItem), 1);
        newBasket.push(menuItem);
        setBasket(newBasket);
      } else if (menuItem.quantity === 0 && basket.includes(menuItem)) {
        const newBasket = [...basket];
        newBasket.splice(basket.indexOf(menuItem), 1);
        setBasket(newBasket);
      }
    });
  };

  const basketTotalPrice = () => {
    let totalPrice = 0;
    basket.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  };

  const basketTotalItems = () => {
    let totalItems = 0;
    basket.forEach((item) => {
      totalItems += item.quantity;
    });
    return totalItems;
  };

  const closeBottomSheet = () => {
    sheetRef.current.snapTo({ initialSheetHeight, fullSheetHeight });
  };

  const DisplayItemsInBasket = () => {
    if (basket.length === 0)
      return (
        <Stack
          direction="column"
          style={{ margin: "20px" }}
          alignItems="center"
          spacing={3}
        >
          <Alert
            message="The order is empty"
            type="info"
            showIcon
            description="There are no items in the order. You can add more using the selection table above."
          />
          <Button
            icon={<PlusOutlined />}
            size="large"
            onClick={closeBottomSheet}
            type="primary"
          >
            Add item
          </Button>
        </Stack>
      );
    else
      return basket.map((item) => {
        return (
          <OrderItem key={item.name} color={item.color} item={item}></OrderItem>
        );
      });
  };

  useEffect(() => {
    getMenusItems();
    getTableInformation(tableId).then((res) => {
      setTableOrderId(res.data.tableOrderId);
    });
  }, []);

  useEffect(() => {
    checkItemInBasket();
  }, [menuItems]);

  return (
    <div>
      <CategoryButtons
        selected={lastButtonClicked}
        functionOnClick={getNewItems}
        displayGrid={displayGrid}
      />
      <Divider style={{ margin: 20 }} />
      {displayGrid ? (
        <DishDisplayTable
          currDisplayingItems={currDisplayingItems}
          menuItems={menuItems}
          setMenuItemsFunc={setMenuItems}
        />
      ) : (
        ""
      )}
      <BottomSheet
        onSpringStart={onBottomSheetDrag}
        ref={sheetRef}
        open={true}
        header={
          <BottomSheetHeader
            nbItems={basketTotalItems()}
            totalPrice={basketTotalPrice()}
            onSendOrder={sendOrder}
          />
        }
        blocking={displayContentBottomSheet}
        snapPoints={({}) => [initialSheetHeight, fullSheetHeight]}
      >
        <DisplayItemsInBasket />
      </BottomSheet>
      {contextHolder}
    </div>
  );
};

export default TakeOrderPage;
