import React, {useEffect, useState} from "react";
import {Divider, Grid, Stack} from "@mui/material";
import CategoryButtons from "../components/takeOrder/CategoryButtons";
import DishDisplayTable from "../components/takeOrder/DishDisplayTable";
import {BottomSheet} from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import BottomSheetHeader from "../components/takeOrder/bottomSheet/BottomSheetHeader";
import OrderItem from "../components/takeOrder/bottomSheet/OrderItem";
import {getMenus} from "../api/menus";
import {useParams} from "react-router-dom";
import {
    addItemToTableOrder,
    startTableOrderPreparation,
} from "../api/tablesOrders";
import {Alert, Button, message} from "antd";
import {PlusOutlined, ClockCircleOutlined, TeamOutlined} from "@ant-design/icons";
import {getTableInformation} from "../api/tables";
import {CardItem} from "../components/takeOrder/bottomSheet/CardItems";
import {getMeanCookingTime} from "../api/kitchenInterface";

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

    const [expectedWaitTime, setExpectedWaitTime] = useState(undefined);

    const {tableId} = useParams();

    const BOTTOM_SHEET_VALUE_CLOSED = 94 || 0;

    const initialSheetHeight = window.innerHeight / 9; // Point d'ancrage minimal
    const fullSheetHeight = window.innerHeight * 0.7; // Point d'ancrage maximal

    const onBottomSheetOpen = () => {
        setDisplayContentBottomSheet(true);

        if (basket.length > 0) calculateWaitingTime().then((res) => {
            setExpectedWaitTime(res.toString());
        });
    };

    const calculateWaitingTime = () => {
        return new Promise((resolve) => {
            basket
                .map(async (item) => {
                    const req = await getMeanCookingTime(item.shortName)
                    const timeOneItem = req.data.meanCookingTimeInSec;
                    return timeOneItem * item.quantity;
                })
                .reduce((time) => {
                    return time;
                })
                .then((totalTime) => {
                    resolve(totalTime);
                });
        });
    }

    const closeBottomSheet = () => {
        sheetRef.current.snapTo({initialSheetHeight, fullSheetHeight});
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

    const BottomSheetContent = () => {
        if (basket.length === 0)
            return (
                <Stack direction="column" style={{margin: "20px"}} alignItems="center" spacing={3}>
                    <Alert message="The order is empty" type="info" showIcon
                           description="There are no items in the order. You can add more using the selection table above."/>
                    <Button icon={<PlusOutlined/>} size="large" onClick={closeBottomSheet} type="primary">
                        Add item
                    </Button>
                </Stack>
            );
        else
            return basket.map((item) => {
                return (
                    <OrderItem key={item._id} color={item.color} item={item}></OrderItem>
                );
            });
    };

    const BottomSheetFooter = () => {
        if (basket.length > 0) {
            return (<Grid container spacing={2}>
                <Grid item xs={6}>
                    <CardItem subtitle="Current: 4/5" title="Recommendation" value="5" prefix={<TeamOutlined/>}
                              suffix="plates" color="#FF0000FF"/>
                </Grid>
                <Grid item xs={6}>
                    <CardItem title="Expected wait time" value={expectedWaitTime} prefix={<ClockCircleOutlined/>}
                              suffix="sec"/>
                </Grid>
            </Grid>);
        }
    }

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
            <CategoryButtons selected={lastButtonClicked} functionOnClick={getNewItems} displayGrid={displayGrid}/>
            <Divider style={{margin: 20}}/>
            {displayGrid ? (
                <DishDisplayTable currDisplayingItems={currDisplayingItems} menuItems={menuItems}
                                  setMenuItemsFunc={setMenuItems}/>
            ) : (
                ""
            )}
            <BottomSheet onSpringStart={onBottomSheetDrag} ref={sheetRef} open={true}
                         header={
                             <BottomSheetHeader nbItems={basketTotalItems()} totalPrice={basketTotalPrice()}
                                                onSendOrder={sendOrder}/>
                         } blocking={displayContentBottomSheet} footer={<BottomSheetFooter/>}
                         snapPoints={({}) => [initialSheetHeight, fullSheetHeight]}>
                <BottomSheetContent/>
            </BottomSheet>
            {contextHolder}
        </div>
    );
};

export default TakeOrderPage;
