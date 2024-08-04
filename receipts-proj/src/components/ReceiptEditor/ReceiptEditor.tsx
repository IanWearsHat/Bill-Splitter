import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Button, Input } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { useImmer } from "use-immer";

import { ObjectContext } from "./ObjectContext";
import { ErrorContext } from "./ErrorContext";
import NameColumn from "../NameColumn/NameColumn";
import ReceiptColumn from "../ReceiptColumn/ReceiptColumn";

import { isEditModeContext } from "./isEditModeContext";
import { ItemsMap } from "./ItemsMap";
import {
  FormMap,
  convertItemsObject,
  createFormData,
} from "./formCreationHelpers";
import "./ReceiptEditor.css";
import OneClickButton from "../lib/OneClickButton";
import { useNavigate } from "react-router-dom";

const sendReceiptURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/createReceipt";
// const sendReceiptURL = "http://localhost:3000/createReceipt";
const sendDeleteURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/deleteReceipt";
// const sendDeleteURL = "http://localhost:3000/deleteReceipt";
const loadReceiptURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/loadReceipt";
// const loadReceiptURL = "http://localhost:3000/loadReceipt";

export default function ReceiptEditor() {
  const navigate = useNavigate();

  const [selectedName, setSelectedName] = useState<string>("");
  const [receiptName, setReceiptName] = useState<string>("");

  const [names, setNames] = useState<Array<Array<string | number>>>([]);

  const [items, setItems] = useImmer<ItemsMap>({});
  const [lastItems, setLastItems] = useImmer<ItemsMap>({});

  const [isEditMode, setIsEditMode] = useState(false);
  const [receiptShown, setReceiptShown] = useState(false);

  const [userCanEdit, setUserCanEdit] = useState(false);

  const [saveIsDisabled, setSaveIsDisabled] = useState(false);
  const [deleteIsDisabled, setDeleteIsDisabled] = useState(false);

  function sendReceiptRequest() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const receiptString = window.location.pathname
      .replace("/editor", "")
      .substring(1);
    const data = {
      token: token,
      receiptID: receiptString,
      ...createFormData(receiptName, names, items, lastItems),
    };

    setSaveIsDisabled(true);

    fetch(sendReceiptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.receiptID) {
          console.log(data.receiptID);
          window.history.replaceState(
            null,
            "",
            window.location.pathname + "/" + data.receiptID
          );
        }
        setSaveIsDisabled(false);
      })
      .catch((error) => {
        console.error(error);
        setSaveIsDisabled(false);
      });
  }

  function sendDeleteRequest() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const receiptString = window.location.pathname
      .replace("/editor", "")
      .substring(1);

    const data = {
      token: token,
      receiptID: receiptString,
    };

    setDeleteIsDisabled(true);
    fetch(sendDeleteURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);

        setDeleteIsDisabled(false);
        navigate("/editor");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        setDeleteIsDisabled(false);
      });
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
    if (!token) {
      setIsEditMode(false);
      setReceiptShown(false);
      setUserCanEdit(false);
    }

    const receiptString = window.location.pathname
      .replace("/editor", "")
      .substring(1);
    if (!receiptString) return;

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
        receiptID: receiptString,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        try {
          receiptData = data;

          if (!receiptData) return;
          const { isSameUser, ...finalReceiptData } = receiptData;

          // set user perms
          setUserCanEdit(isSameUser);
          setIsEditMode(false);
          setReceiptShown(true);

          // load receipt data into state
          setReceiptName(finalReceiptData.receiptName);
          setNames(finalReceiptData.buyers);
          setItems(convertItemsObject(finalReceiptData.items));
          setLastItems(convertItemsObject(finalReceiptData.finalItems));
        } catch (err) {
          console.log(err);
        }
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
    <>
      {!receiptShown && (
        <Button
          onClick={() => {
            setReceiptShown(true);
            setUserCanEdit(true);
            setIsEditMode(true);
          }}
        >
          Create Receipt
        </Button>
      )}
      {receiptShown && (
        <div id="allReceiptInfo">
          <div id="header">
            {userCanEdit && isEditMode ? (
              <Input
                sx={{ maxWidth: 500 }}
                placeholder="Enter Receipt Name"
                value={receiptName}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setReceiptName(event.target.value)
                }
              />
            ) : (
              <h1 id="receiptName">{receiptName}</h1>
            )}

            {userCanEdit && (
              <div id="buttonSuite">
                <Button
                  onClick={() => setIsEditMode(!isEditMode)}
                  variant="contained"
                  startIcon={<ModeEditIcon />}
                >
                  Edit
                </Button>
                {isEditMode && (
                  <>
                    <OneClickButton
                      onClick={sendReceiptRequest}
                      variant="contained"
                      color="warning"
                      startIcon={<SaveIcon />}
                      buttonIsDisabled={saveIsDisabled}
                    >
                      Save
                    </OneClickButton>
                    <OneClickButton
                      onClick={sendDeleteRequest}
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      buttonIsDisabled={deleteIsDisabled}
                    >
                      Delete
                    </OneClickButton>
                  </>
                )}
              </div>
            )}
          </div>

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
              <isEditModeContext.Provider value={isEditMode}>
                <div id="editor">
                  <NameColumn />
                  <ReceiptColumn />
                </div>
              </isEditModeContext.Provider>
            </ObjectContext.Provider>
          </ErrorContext.Provider>
        </div>
      )}
      {/* </div> */}
    </>
  );
}
/*

JWT token user exists and matches user from receipt:        READ AND WRITE

JWT token user exists and doesn't match user from receipt:  READ ONLY
JWT token user does not exist:                              READ ONLY

*/
