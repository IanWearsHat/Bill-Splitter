import { useCallback, useContext } from "react";

import { ObjectContext } from "../ReceiptEditor/ObjectContext";
import { ItemsMap } from "../ReceiptEditor/ItemsMap";
import TableReceipt from "./TableReceipt";
import "./ReceiptColumn.css";

export default function ReceiptColumn() {
  const { selectedName, items, setItems, lastItems, setLastItems } =
    useContext(ObjectContext);

  const calculateTotal = useCallback((items: ItemsMap) => {
    let total = 0;
    Object.values(items).forEach((item) => {
      total += item.totalPrice;
    });
    return total;
  }, []);

  const calculateUserTotal = useCallback(
    (selectedName: string, items: ItemsMap) => {
      let total = 0;
      Object.values(items).map((item) => {
        if (item.buyers[selectedName]) total += item.buyers[selectedName];
      });
      return total;
    },
    []
  );

  const subtotal = calculateTotal(items);
  const total = calculateTotal(items) + calculateTotal(lastItems);

  const userSubtotal = calculateUserTotal(selectedName, items);
  const userTotal =
    calculateUserTotal(selectedName, items) +
    calculateUserTotal(selectedName, lastItems);

  return (
    <div id="tables">
      <TableReceipt
        selectedName={selectedName}
        items={items}
        setItems={setItems}
      />
      <hr />
      <TableReceipt
        selectedName={selectedName}
        items={lastItems}
        setItems={setLastItems}
        isTotalCalculation
        subtotal={subtotal}
        total={total}
        userSubtotal={userSubtotal}
        userTotal={userTotal}
      />
    </div>
  );
}
