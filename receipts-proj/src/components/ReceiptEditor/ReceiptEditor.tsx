import { ChangeEvent, useEffect, useState } from "react";
import NameColumn from "../NameColumn/NameColumn";
import ReceiptColumn from "../ReceiptColumn/ReceiptColumn";

import "./ReceiptEditor.css";
import { ErrorContext } from "./ErrorContext";
import { Button, Input } from "@mui/material";
import { useImmer } from "use-immer";

const createReceiptURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/createReceipt";
// const createReceiptURL = "http://localhost:3000/createReceipt";
const loadReceiptURL = "http://localhost:3000/loadReceipt";

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
  names: Array<Array<string | number>>,
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
    buyersToPrices[name[0]] = 0;
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

function convertItemsObject(items: Array<{ [key: string]: string | number }>) {
  const itemsObj: UpdateItemsMap = {};
  for (let i = 0; i < items.length; i++) {
    const { name, totalPrice, ...restItems } = items[i];

    itemsObj[name] = {
      id: i,
      buyers: { ...restItems } as {
        [key: string]: number;
      },
      totalPrice: totalPrice as number,
    };
  }
  console.log(itemsObj);
  return itemsObj;
}

export default function ReceiptEditor() {
  const [selectedName, setSelectedName] = useState<string>("");
  const [receiptName, setReceiptName] = useState<string>("");

  const [names, setNames] = useState<Array<Array<string | number>>>([]);

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
  // {
  //   id: 'ce2b5448139d4929b81e8a53d7469e16',
  //   receiptName: 'new',
  //   buyers: [ [ 'ian', 2 ], [ 'was', 25 ] ],
  //   items: [ { name: 'bag bag bag', totalPrice: 2, ian: 1, was: 22 } ],
  //   finalItems: [ { name: 'tax', totalPrice: 5, was: 3, ian: 1 } ]
  // }

  function loadReceipt() {
    let receiptData: {
      user: string;
    } & FormMap = {
      user: "",
      receiptName: "",
      buyers: [],
      items: [],
      finalItems: [],
    };

    fetch(loadReceiptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiptID: window.location.pathname.substring(1) }),
    })
      .then((response) => response.json())
      .then((data) => {
        receiptData = data;

        if (!receiptData) return;
        const { user, ...finalReceiptData } = receiptData;

        console.log(user);
        setReceiptName(finalReceiptData.receiptName);
        setNames(finalReceiptData.buyers);
        setItems(convertItemsObject(finalReceiptData.items));
        setLastItems(convertItemsObject(finalReceiptData.finalItems));
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
      <Button onClick={sendCreateReceiptRequest}>Create Receipt</Button>
      <Button onClick={loadReceipt}>Load</Button>
      <Button
        onClick={() =>
          convertItemsObject([
            { name: "bag bag bag", totalPrice: 2, ian: 1, was: 22 },
            { name: "bag f", totalPrice: 2, ian: 1, was: 22 },
          ])
        }
      >
        Convert
      </Button>
    </>
  );
}
