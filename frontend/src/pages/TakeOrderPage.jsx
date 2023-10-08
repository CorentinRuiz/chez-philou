import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import CategoryButtons from "../components/takeOrder/CategoryButtons";
import DishDisplayTable from "../components/takeOrder/DishDisplayTable";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import BottomSheetHeader from "../components/takeOrder/bottomSheet/BottomSheetHeader";
import OrderItem from "../components/takeOrder/bottomSheet/OrderItem";
import { getMenus } from "../api/menus";
import { useParams, useNavigate } from "react-router-dom";
import { billModal } from "../components/chooseTable/ModalDisplay";
import {
  createBillForTheTable,
  getCustomersCountOnTableOrder,
  getPastOrders,
  sendOrderToKitchen,
} from "../api/tablesOrders";
import { Collapse, message } from "antd";
import { ClockCircleOutlined, TeamOutlined } from "@ant-design/icons";
import { getTableInformation } from "../api/tables";
import { CardItem } from "../components/takeOrder/bottomSheet/CardItems";
import { getMeanCookingTimeOfSeveralItems } from "../api/kitchenInterface";
import { getColorDimmed } from "../components/utils";
import EmptyBasketDisplay from "../components/takeOrder/bottomSheet/EmptyBasketDisplay";

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
  const [oldService, setOldService] = useState([]);
  const sheetRef = React.useRef();

  const [expectedWaitTime, setExpectedWaitTime] = useState(undefined);
  const [customersCount, setCustomersCount] = useState(undefined);

  const { tableId } = useParams();
  const navigate = useNavigate();

  const BOTTOM_SHEET_VALUE_CLOSED = 94 || 0;

  const initialSheetHeight = window.innerHeight / 9; // Point d'ancrage minimal
  const fullSheetHeight = window.innerHeight * 0.7; // Point d'ancrage maximal

  const onBottomSheetOpen = () => {
    setDisplayContentBottomSheet(true);

    if (basket.length > 0)
      getWaitingTimeOfAllBasket().then((res) => {
        setExpectedWaitTime(res.toString());
      });
  };

  const getWaitingTimeOfAllBasket = () => {
    return new Promise(async (resolve) => {
      getMeanCookingTimeOfSeveralItems(basket).then((res) => {
        resolve(res.data.cookingTime);
      });
    });
  };

  const closeBottomSheet = () => {
    sheetRef.current.snapTo({ initialSheetHeight, fullSheetHeight });
  };

  const onBottomSheetDrag = async () => {
    requestAnimationFrame(() => {
      const height = sheetRef.current.height;
      // Bottom Sheet Open
      if (height > BOTTOM_SHEET_VALUE_CLOSED) onBottomSheetOpen();
      // Bottom Sheet Initial or Open
      else {
        // Set to 0 the waiting time
        setExpectedWaitTime(undefined);
        setDisplayContentBottomSheet(false);
      }
    });
  };

  const onAddComment = (item, comment) => {
    if (item.quantity !== 0) {
      const newBasket = [...basket];
      newBasket[basket.indexOf(item)].comment = comment;
      setBasket(newBasket);
    } else {
      messageApi.error(
        `Vous ne pouvez pas ajouter de commentaire à un plat non commandé`
      );
    }
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

  const sendOrder = async () => {
    await sendOrderToKitchen(basket, tableOrderId);

    messageApi.success(`Commande bien envoyée à la cuisine`);

    navigate("/");
  };

  const onCreateBill = () => {
    billModal(
      getGroupedItemByService(),
      (tableOrderId) => {
        createBillForTheTable(tableOrderId).then(() => {
          messageApi.success(`Facture bien créée`);
          navigate("/");
        });
      },
      tableOrderId,
      orderTotalPrice()
    );
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
    return basket
      .map((item) => item.quantity * item.price)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  };

  const orderTotalPrice = () => {
    const totalCost = oldService
      .flatMap((preparation) =>
        preparation.preparedItems.map((item) => item.quantity * item.price)
      )
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return totalCost;
  };

  const basketTotalItems = () => {
    return basket
      .map((item) => item.quantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  };

  const getOldService = (id) => {
    getPastOrders(id).then((res) => {
      setOldService(res.data);
    });
  };

  const getGroupedItemByService = () => {
    return Array.from(oldService).map((item) => ({
      style: { background: getColorDimmed(item.color, 0.3) },
      key: item._id,
      label: item.name + " Order",
      children: Array.from(item.preparedItems).map((item) => (
        <OrderItem key={item._id} color={item.color} item={item}></OrderItem>
      )),
    }));
  };

  const BottomSheetContent = () => {
    return (
      <>
        {oldService.length > 0 ? (
          <Collapse bordered={false} items={getGroupedItemByService()} />
        ) : (
          ""
        )}
        {basket.length === 0 ? (
          <EmptyBasketDisplay
            orderState={oldService.length}
            closeBottomSheet={closeBottomSheet}
            onCreateBill={onCreateBill}
            totalOrderPrice={orderTotalPrice}
          />
        ) : (
          basket.map((item) => (
            <OrderItem
              key={item._id}
              color={item.color}
              item={item}
            ></OrderItem>
          ))
        )}
      </>
    );
  };

  const getRecommendationInfos = () => {
    const firstCategory = getFirstCategory();
    const itemsOfFirstCategory = getItemsOfCategory(firstCategory);
    const totalCount = countItems(itemsOfFirstCategory);
    return {
      subtitle: getSubtitleForRecommendation(totalCount),
      firstCategory: firstCategory,
      color: isRecommendationWarning(totalCount) ? "#FF0000FF" : "#45b909",
    };
  };

  const getFirstCategory = () => {
    return basket[0].category;
  };

  const countItems = (items) => {
    return items
      .map((item) => item.quantity)
      .reduce((previous, current) => previous + current, 0);
  };

  const getItemsOfCategory = (categoryResearched) => {
    return basket.filter((item) => item.category === categoryResearched);
  };

  const getSubtitleForRecommendation = (totalCount) => {
    return isRecommendationWarning(totalCount)
      ? `Current: ${totalCount}/${customersCount}`
      : "";
  };
  const isRecommendationWarning = (recommendationTotalCount) => {
    return recommendationTotalCount !== customersCount;
  };

  const BottomSheetFooter = () => {
    if (basket.length > 0) {
      const { subtitle, firstCategory, color } = getRecommendationInfos();
      return (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CardItem
              subtitle={subtitle}
              title="Recommendation"
              value={customersCount.toString()}
              prefix={<TeamOutlined />}
              suffix={`${firstCategory.toLowerCase()}${
                customersCount > 1 ? "s" : ""
              }`}
              color={color}
            />
          </Grid>
          <Grid item xs={6}>
            <CardItem
              title="Expected wait time"
              value={expectedWaitTime}
              prefix={<ClockCircleOutlined />}
              suffix="sec"
            />
          </Grid>
        </Grid>
      );
    }
  };

  useEffect(() => {
    (async () => {
      await getMenusItems();
      await getTableInformation(tableId).then(async (res) => {
        setTableOrderId(res.data.tableOrderId);
        getOldService(res.data.tableOrderId);
        await getCustomersCountOnTableOrder(res.data.tableOrderId).then(
          (res) => {
            setCustomersCount(res);
          }
        );
      });
    })();
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
          addCommentFunc={onAddComment}
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
        footer={<BottomSheetFooter />}
        snapPoints={({}) => [initialSheetHeight, fullSheetHeight]}
      >
        <BottomSheetContent />
      </BottomSheet>
      {contextHolder}
    </div>
  );
};

export default TakeOrderPage;
