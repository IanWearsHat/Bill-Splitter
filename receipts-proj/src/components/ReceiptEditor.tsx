import { useState } from "react";
import NameColumn from "./NameColumn";
import ReceiptColumn from "./ReceiptColumn";

export default function ReceiptEditor() {
  const [selectedName, setSelectedName] = useState<string>("");
  return (
    <>
      <NameColumn onButtonClick={setSelectedName} />
      <p>Selected: {selectedName}</p>
      <ReceiptColumn selectedName={selectedName}/>
    </>
  );
}
