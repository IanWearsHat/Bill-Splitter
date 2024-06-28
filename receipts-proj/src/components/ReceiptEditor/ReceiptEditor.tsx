import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Button, Input } from "@mui/material";
import { useImmer } from "use-immer";

import { ErrorContext } from "./ErrorContext";
import NameColumn from "../NameColumn/NameColumn";
import ReceiptColumn from "../ReceiptColumn/ReceiptColumn";

import { ItemsMap } from "./ItemsMap";
import {
  FormMap,
  convertItemsObject,
  createFormData,
} from "./formCreationHelpers";
import "./ReceiptEditor.css";

const createReceiptURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/createReceipt";
// const createReceiptURL = "http://localhost:3000/createReceipt";
const loadReceiptURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/loadReceipt";
// const loadReceiptURL = "http://localhost:3000/loadReceipt";

export default function ReceiptEditor() {
  const [selectedName, setSelectedName] = useState<string>("");
  const [receiptName, setReceiptName] = useState<string>("");

  const [names, setNames] = useState<Array<Array<string | number>>>([]);

  const [items, setItems] = useImmer<ItemsMap>({});
  const [lastItems, setLastItems] = useImmer<ItemsMap>({});

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

  const loadReceipt = useCallback(() => {
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
      body: JSON.stringify({
        receiptID: window.location.pathname.substring(1),
      }),
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
  }, [setItems, setLastItems]);

  useEffect(() => {
    loadReceipt();
  }, [loadReceipt]);

  useEffect(() => {
    console.log(items);
    console.log(lastItems);
  }, [items, lastItems]);

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
    </>
  );
}
