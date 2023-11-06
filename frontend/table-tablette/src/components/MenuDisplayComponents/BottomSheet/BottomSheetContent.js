import React,{useEffect} from "react";
import EmptyBasketDisplay from "./EmptyBasketDisplay";
import OrderItem from "./OrderItem";
import {getColorDimmed} from "../../utils";


const BottomSheetContent = ({
  open,
  openBottomSheet,
  oldService,
  closeBottomSheet,
  basket,
}) => {

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

  return (
    <>
      {/* {oldService.length > 0 ? (
        <Collapse bordered={false} items={getGroupedItemByService()} />
      ) : (
        ""
      )} */}
      {basket.length === 0 ? (
        <EmptyBasketDisplay
          closeBottomSheet={closeBottomSheet}
        />
      ) : (
        basket.map((item) => (
          <OrderItem key={item._id} color={item.color} item={item}></OrderItem>
        ))
      )}
    </>
  );
};

export default BottomSheetContent;
