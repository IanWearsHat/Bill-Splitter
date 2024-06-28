import { ChangeEvent, useEffect, useState } from "react";
import NameColumn from "../NameColumn/NameColumn";
import ReceiptColumn from "../ReceiptColumn/ReceiptColumn";

import "./ReceiptEditor.css";
import { ErrorContext } from "./ErrorContext";
import { Button, Input } from "@mui/material";
import { useImmer } from "use-immer";

const createReceiptURL = "http://localhost:3000/createReceipt";

interface UpdateItemsMap {
  [key: string]: {
    id: number;
    buyers: { [key: string]: number };
    totalPrice: number;
  };
}

interface FormMap {
  receiptName: string;
  buyers: Array<Array<string | number>>;
  items: Array<{ [key: string]: string | number }>;
  finalItems: Array<{ [key: string]: string | number }>;
}

function createItemsList(
  items: UpdateItemsMap,
  buyersToPrices: { [key: string]: number }
) {
  const itemsArr: Array<{
    [key: string]: number | string;
  }> = [];
  Object.entries(items).map(([itemName, itemData]) => {
    itemsArr.push({
      name: itemName,
      totalPrice: itemData.totalPrice,
      ...itemData.buyers,
    });

    // Adds total from this item for that buyer
    Object.entries(itemData.buyers).map(([buyerName, amountOwed]) => {
      buyersToPrices[buyerName] += amountOwed;
    });
  });
  return itemsArr;
}

function createFormData(
  receiptName: string,
  names: Array<string>,
  items: UpdateItemsMap,
  lastItems: UpdateItemsMap
) {
  const receipt: FormMap = {
    receiptName: receiptName,
    buyers: [],
    items: [],
    finalItems: [],
  };

  const buyersToPrices: { [key: string]: number } = {};
  names.map((name) => {
    buyersToPrices[name] = 0;
  });

  receipt.items = createItemsList(items, buyersToPrices);
  receipt.finalItems = createItemsList(lastItems, buyersToPrices);

  const buyersList: Array<Array<string | number>> = [];
  Object.entries(buyersToPrices).map(([name, amountOwed]) => {
    buyersList.push([name, amountOwed]);
  });
  receipt.buyers = buyersList;

  return receipt;
}

export default function ReceiptEditor() {
  const [selectedName, setSelectedName] = useState<string>("");
  const [receiptName, setReceiptName] = useState<string>("");

  const [names, setNames] = useState<Array<string>>([]);

  const [items, setItems] = useImmer<UpdateItemsMap>({});
  const [lastItems, setLastItems] = useImmer<UpdateItemsMap>({});

  useEffect(() => {
    console.log(items);
    console.log(lastItems);
  }, [items, lastItems]);

  function sendCreateReceiptRequest() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const data = {
      token: token,
      ...createFormData(receiptName, names, items, lastItems),
    };

    fetch(createReceiptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error));
  }

  return (
    <>
      <Input
        placeholder="Enter Receipt Name"
        value={receiptName}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setReceiptName(event.target.value)
        }
      />
      <ErrorContext.Provider value={""}>
        <div id="editor">
          <NameColumn
            selectedName={selectedName}
            names={names}
            setNames={setNames}
            onButtonClick={setSelectedName}
          />
          <ReceiptColumn
            selectedName={selectedName}
            items={items}
            setItems={setItems}
            lastItems={lastItems}
            setLastItems={setLastItems}
          />
        </div>
      </ErrorContext.Provider>
      <Button onClick={sendCreateReceiptRequest}>Print</Button>
    </>
  );
}
