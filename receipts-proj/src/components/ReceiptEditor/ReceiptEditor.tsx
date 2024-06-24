import { useState } from "react";
import NameColumn from "../NameColumn/NameColumn";
import ReceiptColumn from "../ReceiptColumn/ReceiptColumn";

import "./ReceiptEditor.css";
import { SelectedNameContext } from "./SelectedNameContext";

export default function ReceiptEditor() {
  const [selectedName, setSelectedName] = useState<string>("");
  return (
    <>
      <p>Selected: {selectedName}</p>
      <SelectedNameContext.Provider value={selectedName}>
        <div id="editor">
          <NameColumn
            selectedName={selectedName}
            onButtonClick={setSelectedName}
          />
          <ReceiptColumn selectedName={selectedName} />
        </div>
      </SelectedNameContext.Provider>
    </>
  );
}
