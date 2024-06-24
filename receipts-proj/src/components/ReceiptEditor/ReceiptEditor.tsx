import { useState } from "react";
import NameColumn from "../NameColumn/NameColumn";
import ReceiptColumn from "../ReceiptColumn/ReceiptColumn";

import "./ReceiptEditor.css";

export default function ReceiptEditor() {
  const [selectedName, setSelectedName] = useState<string>("");
  return (
    <>
      <p>Selected: {selectedName}</p>
      <div id="editor">
        <NameColumn onButtonClick={setSelectedName} />
        <ReceiptColumn selectedName={selectedName} />
      </div>
    </>
  );
}
