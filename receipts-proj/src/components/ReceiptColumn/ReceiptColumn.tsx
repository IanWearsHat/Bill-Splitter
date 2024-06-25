import { useImmer } from "use-immer";

import "./ReceiptColumn.css";
import TableReceipt from "./TableReceipt";
import { useCallback, useEffect } from "react";

interface ReceiptColumnProps {
  selectedName: string;
}

interface UpdateItemsMap {
  [key: string]: {
    id: number;
    name: string;
    buyers: { [key: string]: number };
    totalPrice: number;
  };
}

export default function ReceiptColumn({ selectedName }: ReceiptColumnProps) {
  const [items, setItems] = useImmer<UpdateItemsMap>({});
  const [lastItems, setLastItems] = useImmer<UpdateItemsMap>({});

  useEffect(() => {
    console.log(items);
    console.log(lastItems);
  }, [items, lastItems]);

  const calculateTotal = useCallback((items: UpdateItemsMap) => {
    let total = 0;
    Object.values(items).forEach((item) => {
      total += item.totalPrice;
    });
    return total;
  }, []);

  const calculateUserTotal = useCallback(
    (selectedName: string, items: UpdateItemsMap) => {
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
