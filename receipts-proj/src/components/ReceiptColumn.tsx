import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import "./ReceiptColumn.css";
import { useImmer } from "use-immer";

let nextId = 0;
interface ReceiptColumnProps {
  selectedName: string;
}

export default function ReceiptColumn({ selectedName }: ReceiptColumnProps) {
  const [itemName, setItemName] = useState<string>("");
  const [items, setItems] = useImmer<object>({});

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <div>
      <div>
        {Object.entries(items).map(([key, value]) => (
          <div key={key}>
            <p>
              {key} {value.id}{" "}
              {Object.entries(value.buyers).find(([name, price]) => {
                if (name === selectedName) {
                  return [selectedName, price];
                }
              }) || [selectedName, undefined]}
            </p>

            <Button
              id={key}
              variant="outlined"
              color="error"
              onClick={() => {
                const newItems: {
                  [key: string]: string | number;
                } = { ...items };
                delete newItems[key];
                setItems(newItems);
              }}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      <div id="addNameGroup">
        <TextField
          id="outlined-basic"
          label="Add Item"
          variant="outlined"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            setItemName("");
            setItems({
              ...items,
              [itemName]: {
                id: nextId++,
                buyers: { Ian: 12, John: 19, Cry: 20 },
              },
            });
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
