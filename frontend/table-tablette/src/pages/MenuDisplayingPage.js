import React, {useEffect, useState} from "react";
import CategoryButtons from "../components/MenuDisplayComponents/CategoryButtons";
import DishDisplayTable from "../components/MenuDisplayComponents/DishDisplayTable";
import BottomSheetHeader from "../components/MenuDisplayComponents/BottomSheet/BottomSheetHeader";
import BottomSheetContent from "../components/MenuDisplayComponents/BottomSheet/BottomSheetContent";
import "react-spring-bottom-sheet/dist/style.css";
import {getMenus} from "../api/menus";
import {Button, message} from "antd";
import {BottomSheet} from "react-spring-bottom-sheet";
import io from "socket.io-client";
import {getPastOrders} from "../api/orders";
import {useLocation, useNavigate} from "react-router-dom";

const MenuDisplayingPage = ({tableInfos}) => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [displayGrid, setDisplayGrid] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [lastButtonClicked, setLastButtonClicked] = useState("");
    const [currDisplayingItems, setCurrDisplayingItems] = useState([]);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [oldService, setOldService] = useState([]);
    const sheetRef = React.useRef();
    const [displayContentBottomSheet, setDisplayContentBottomSheet] =
        useState(false);
    const [basket, setBasket] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const BOTTOM_SHEET_VALUE_CLOSED = 96 || 0;

    const initialSheetHeight = window.innerHeight / 8; // Point d'ancrage minimal
    const fullSheetHeight = window.innerHeight * 0.7; // Point d'ancrage maximal

    const onBottomSheetDrag = async () => {
        requestAnimationFrame(() => {
            const height = sheetRef.current.height;

            // Bottom Sheet Open
            if (height > BOTTOM_SHEET_VALUE_CLOSED) onBottomSheetOpen();
            // Bottom Sheet Initial or Open
            else {
                setIsBottomSheetOpen(false);
                setDisplayContentBottomSheet(false);
            }
        });
    };

    const orderTotalPrice = () => {
        return oldService
            .flatMap((preparation) =>
                preparation.preparedItems.map((item) => item.quantity * item.price)
            )
            .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    };

    const openBottomSheet = () => {
        sheetRef.current.snapTo(({snapPoints}) => Math.max(...snapPoints));
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

    const getOldService = (id) => {
        getPastOrders(id).then((res) => {
            setOldService(res.data);
        });
    };

    useEffect(() => {
        if(tableInfos !== null) {
            getMenusItems();
            getOldService(tableInfos.tableOrderInfos._id);
        }
    }, []);

    useEffect(() => {
        const basketRecover = location?.state?.basket;
        if (basketRecover !== undefined ) {
            setBasket(basketRecover);
            location.state = undefined;
        }

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
            if(res === null || tableInfos === null) return;
            if (parseInt(res.tableNumber) === parseInt(tableInfos.tableNumber))
                setBasket(res.baskets);
        });

        newSocket.on("OpenRecapBasket", (res) => {
            if(res === null || tableInfos === null) return;
            const tableNumber = res.tableNumber;
            const basket = res.basket;
            if (parseInt(tableNumber) === parseInt(tableInfos.tableNumber)) {
                setIsBottomSheetOpen(true);
                setBasket(basket);
            }
        })
    }, []);

    const BackButton = () => {
        const from = location?.state?.from;
        if (from !== undefined) return <Button shape="round" type="dashed"
                                               style={{position: "fixed", top: 15, left: 15, zIndex: 2}}
                                               onClick={() => navigate(from)}>Retour</Button>
    }

    return (
        <div>
            <BackButton/>
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
                open={true}
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
                    startCommand={isBottomSheetOpen}
                    openBottomSheet={openBottomSheet}
                    basket={basket}
                    totalOrderPrice={orderTotalPrice}
                    oldService={oldService}
                />

            </BottomSheet>
            {messageContextHolder}
        </div>
    );
};

export default MenuDisplayingPage;
