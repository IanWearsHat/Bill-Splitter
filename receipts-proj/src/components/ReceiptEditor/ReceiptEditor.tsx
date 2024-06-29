import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Button, Input } from "@mui/material";
import { useImmer } from "use-immer";

import { ObjectContext } from "./ObjectContext";
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
import { IsReadOnlyContext } from "./IsReadOnlyContext";

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

  const [isReadOnly, setIsReadOnly] = useState(true);

  function sendCreateReceiptRequest() {
    const token = localStorage.getItem("token");
    console.log(token);
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
    const token = localStorage.getItem("token");
    if (!token) setIsReadOnly(true);

    let receiptData: {
      isSameUser: boolean;
    } & FormMap = {
      isSameUser: false,
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
        token: token,
        receiptID: window.location.pathname.substring(1),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        receiptData = data;

        if (!receiptData) return;
        const { isSameUser, ...finalReceiptData } = receiptData;
        console.log(isSameUser);
        setIsReadOnly(!isSameUser);
        setReceiptName(finalReceiptData.receiptName);
        setNames(finalReceiptData.buyers);
        setItems(convertItemsObject(finalReceiptData.items));
        setLastItems(convertItemsObject(finalReceiptData.finalItems));
      })
      .catch((error) => console.error(error));
  }, [setItems, setLastItems]);

  // attempt to load receipt on page load
  useEffect(() => {
    loadReceipt();
  }, [loadReceipt]);

  useEffect(() => {
    console.log(items);
    console.log(lastItems);
  }, [items, lastItems]);

  return (
    <div id="page">
      <div id="allReceiptInfo">
        {isReadOnly ? (
          <h1 id="receiptName">{receiptName}</h1>
        ) : (
          <Input
            placeholder="Enter Receipt Name"
            value={receiptName}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setReceiptName(event.target.value)
            }
          />
        )}

        <ErrorContext.Provider value={""}>
          <ObjectContext.Provider
            value={{
              selectedName,
              setSelectedName,
              names,
              setNames,
              items,
              setItems,
              lastItems,
              setLastItems,
            }}
          >
            <IsReadOnlyContext.Provider value={isReadOnly}>
              <div id="editor">
                <NameColumn />
                <ReceiptColumn />
              </div>
            </IsReadOnlyContext.Provider>
          </ObjectContext.Provider>
        </ErrorContext.Provider>

        {!isReadOnly && (
          <Button onClick={sendCreateReceiptRequest}>Create Receipt</Button>
        )}
      </div>
      <Button onClick={() => setIsReadOnly(false)}>click</Button>
    </div>
  );
}
/*

JWT token user exists and matches user from receipt:        READ AND WRITE

JWT token user exists and doesn't match user from receipt:  READ ONLY
JWT token user does not exist:                              READ ONLY

*/
