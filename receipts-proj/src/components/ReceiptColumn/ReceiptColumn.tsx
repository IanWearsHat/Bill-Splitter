import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

import { PriceInput } from "../lib/PriceInput";
import "./ReceiptColumn.css";

let nextId = 0;
interface ReceiptColumnProps {
  selectedName: string;
}

interface ItemsMap {
  [key: string]: string | number;
}

interface UpdateItemsMap {
  [key: string]: {
    name: string;
    buyers: { [key: string]: number };
  };
}

export default function ReceiptColumn({ selectedName }: ReceiptColumnProps) {
  const [itemName, setItemName] = useState<string>("");
  const [items, setItems] = useImmer<object>({});

  useEffect(() => {
    console.log(items);
  }, [items]);

  // function updateReceiptPrice(itemName: string, newPrice: number) {
  //   setItems((draft: UpdateItemsMap) => {
  //     draft[itemName]["buyers"][selectedName] = newPrice;
  //   });
  // }

  return (
    <div className="itemsList">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableBody>
            {Object.entries(items).map(([receiptItemName, value]) => (
              <TableRow
                key={receiptItemName}
                // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {receiptItemName}
                </TableCell>

                <TableCell align="right">
                  <PriceInput
                    inputValue={
                      value.buyers[selectedName]
                        ? value.buyers[selectedName]
                        : ""
                    }
                    updateReceiptPrice={(newPrice: number) => {
                      setItems((draft: UpdateItemsMap) => {
                        draft[receiptItemName]["buyers"][selectedName] =
                          newPrice;
                      });
                    }}
                    disabled={selectedName === ""}
                    placeholder={
                      selectedName === ""
                        ? "Select buyer first"
                        : "Enter buyer total"
                    }
                  />
                  {" / "}
                  <PriceInput placeholder="Enter total" />
                  <Button
                    id={receiptItemName}
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      const newItems: ItemsMap = { ...items };
                      delete newItems[receiptItemName];
                      setItems(newItems);
                    }}
                  >
                    Delete Item
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
                buyers: {},
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
