import { getMenus } from "./menus";

const menus = await getMenus();

export const createRestaurantItemList = (tableOrder) => {
  const prepareItems = [];

  for (const preparation of tableOrder.preparations) {
    if (preparation) {
      let preparedItems = [];
      for (const item of preparation.preparedItems) {
        const preparedItem = preparedItems.find((orderedItem) => {
          return orderedItem.shortName === item.shortName;
        });

        if (!preparedItem) {
          const { price, color } = getOrderItemPriceAndColor(item);
          preparedItems.push({
            _id: item._id,
            shortName: item.shortName,
            quantity: 1,
            comment: item.comment,
            color: color,
            price: price,
          });
        } else {
          preparedItem.quantity++;
        }
      }

      const { color, name } = getMajorityColorAndName(preparedItems);

      prepareItems.push({
        _id: preparation._id,
        preparedItems: preparedItems,
        color: color,
        name: name,
      });
    }
  }
  return prepareItems;
};

function getOrderItemPriceAndColor(item) {
  const menuItem = menus.data.find((menuItem) => {
    return menuItem.shortName === item.shortName;
  });

  const result = {
    price: menuItem.price,
    color: "#DDD6FC",
  };

  switch (menuItem.category) {
    case "BEVERAGE":
      result.color = "#C5FBF0";
      return result;
    case "STARTER":
      result.color = "#F9D9C9";
      return result;
    case "DESSERT":
      result.color = "#D1E3F4";
      return result;
    default:
      return result;
  }
}

function getMajorityColorAndName(items) {
  if (items.some((item) => item.catégorie === "MAIN")) {
    return { color: "#DDD6FC", name: "Main" };
  }
  for (const item of items) {
    switch (item.color) {
      case "#C5FBF0":
        return { color: "#C5FBF0", name: "Beverage" };
      case "#DDD6FC":
        return { color: "#DDD6FC", name: "Main" };
      case "#F9D9C9":
        return { color: "#F9D9C9", name: "Starter" };
      case "#D1E3F4":
        return { color: "#D1E3F4", name: "Dessert" };
    }
  }
}
