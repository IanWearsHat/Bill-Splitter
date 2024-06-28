import { useCallback } from "react";

import { ItemsMap } from "../ReceiptEditor/ItemsMap";
import TableReceipt from "./TableReceipt";
import "./ReceiptColumn.css";

interface ReceiptColumnProps {
  selectedName: string;
  items: ItemsMap;
  setItems: (updater: (draft: ItemsMap) => void) => void;
  lastItems: ItemsMap;
  setLastItems: (updater: (draft: ItemsMap) => void) => void;
}

export default function ReceiptColumn({
  selectedName,
  items,
  setItems,
  lastItems,
  setLastItems,
}: ReceiptColumnProps) {
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
