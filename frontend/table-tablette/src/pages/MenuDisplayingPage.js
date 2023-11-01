import React, {useEffect, useState} from "react";
import CategoryButtons from "../components/MenuDisplayComponents/CategoryButtons";
import DishDisplayTable from "../components/MenuDisplayComponents/DishDisplayTable";
import {getMenus} from "../api/menus";
import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "antd";

const MenuDisplayingPage = () => {
    const [displayGrid, setDisplayGrid] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [lastButtonClicked, setLastButtonClicked] = useState("");
    const [currDisplayingItems, setCurrDisplayingItems] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

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

    useEffect(() => {
        getMenusItems();
    }, []);

    const BackButton = () => {
        const from = location?.state?.from;
        if (from !== undefined) return <Button shape="round" type="dashed"
                                               style={{position: "fixed", top: 15, left: 15, zIndex: 1000}}
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
        </div>
    );
};

export default MenuDisplayingPage;
