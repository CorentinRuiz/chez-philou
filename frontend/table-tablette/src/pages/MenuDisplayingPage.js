import React, {useEffect, useState} from "react";
import CategoryButtons from "../components/MenuDisplayComponents/CategoryButtons";
import DishDisplayTable from "../components/MenuDisplayComponents/DishDisplayTable";
import BottomSheetHeader from "../components/MenuDisplayComponents/BottomSheet/BottomSheetHeader";
import BottomSheetContent from "../components/MenuDisplayComponents/BottomSheet/BottomSheetContent";
import "react-spring-bottom-sheet/dist/style.css";
import { getMenus } from "../api/menus";
import { message } from "antd";
import { BottomSheet } from "react-spring-bottom-sheet";
import io from "socket.io-client";

const MenuDisplayingPage = () => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [displayGrid, setDisplayGrid] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [lastButtonClicked, setLastButtonClicked] = useState("");
  const [currDisplayingItems, setCurrDisplayingItems] = useState([]);
  const [open, setOpen] = useState(true);
  const sheetRef = React.useRef();
  const [displayContentBottomSheet, setDisplayContentBottomSheet] =
    useState(false);
  const [basket, setBasket] = useState([]);

  const BOTTOM_SHEET_VALUE_CLOSED = 96 || 0;

  const initialSheetHeight = window.innerHeight / 8; // Point d'ancrage minimal
  const fullSheetHeight = window.innerHeight * 0.7; // Point d'ancrage maximal

  const onBottomSheetDrag = async () => {
    requestAnimationFrame(() => {
      const height = sheetRef.current.height;
      console.log(height);
      // Bottom Sheet Open
      if (height > BOTTOM_SHEET_VALUE_CLOSED) onBottomSheetOpen();
      // Bottom Sheet Initial or Open
      else {
        setDisplayContentBottomSheet(false);
      }
    });
  };

  const openBottomSheet = () => {
    console.log("on monte");
    sheetRef.current.snapTo(({ snapPoints }) => Math.max(...snapPoints));
  };

  const closeBottomSheet = () => {
    sheetRef.current.snapTo({ initialSheetHeight, fullSheetHeight });
  };

  const onBottomSheetOpen = () => {
    setDisplayContentBottomSheet(true);
  };

    const getMenusItems = async () => {
        const menus = await getMenus();
        setMenuItems(menus.data);
        setCurrDisplayingItems(menuItems.data);
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

  const basketTotalItems = () => {
    return basket
      .map((item) => item.quantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  };

  const basketTotalPrice = () => {
    return basket
      .map((item) => item.quantity * item.price)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  };

  useEffect(() => {
    getMenusItems();
  }, []);

  useEffect(() => {
    let wsError = false;

    const newSocket = io(`http://${process.env.REACT_APP_WEBSOCKET_URL}`);

    newSocket.on("connect", () => {
      console.log("Connected to websocket", newSocket.id);
      if (wsError) {
        messageApi.info("Auto-update back online");
        wsError = false;
      }
    });

    newSocket.on("BasketChange", (res) => {
      console.log(res);
      setOpen(true);
      setBasket(res.baskets);
    });
  }, []);

  return (
    <div>
      <CategoryButtons
        selected={lastButtonClicked}
        functionOnClick={getNewItems}
        displayGrid={displayGrid}
      />
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
        open={open}
        header={
          <BottomSheetHeader
            nbItems={basketTotalItems()}
            totalPrice={basketTotalPrice()}
          />
        }
        blocking={displayContentBottomSheet}
        snapPoints={({}) => [initialSheetHeight, fullSheetHeight]}
      >
        <BottomSheetContent
          open={open}
          openBottomSheet={openBottomSheet}
          closeBottomSheet={closeBottomSheet}
          basket={basket}
        />
      </BottomSheet>
      {messageContextHolder}
    </div>
  );
};

export default MenuDisplayingPage;
