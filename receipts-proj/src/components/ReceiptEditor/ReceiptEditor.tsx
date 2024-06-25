import { ChangeEvent, useState } from "react";
import NameColumn from "../NameColumn/NameColumn";
import ReceiptColumn from "../ReceiptColumn/ReceiptColumn";

import "./ReceiptEditor.css";
import { ErrorContext } from "./ErrorContext";
import { Input } from "@mui/material";


export default function ReceiptEditor() {
  const [selectedName, setSelectedName] = useState<string>("");
  const [receiptName, setReceiptName] = useState<string>("");

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
            onButtonClick={setSelectedName}
          />
          <ReceiptColumn selectedName={selectedName} />
        </div>
      </ErrorContext.Provider>
    </>
  );
}
