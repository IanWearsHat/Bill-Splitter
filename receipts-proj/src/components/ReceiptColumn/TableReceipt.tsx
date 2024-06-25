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
import { useState } from "react";

import "./ReceiptColumn.css";
import TableRows from "./TableRows";

let nextId = 0;
interface TableReceiptProps {
  selectedName: string;
  items: UpdateItemsMap;
  setItems: (updater: (draft: UpdateItemsMap) => void) => void;
  isTotalCalculation?: boolean;
  subtotal?: number;
  total?: number;
  userSubtotal?: number;
  userTotal?: number;
}

interface UpdateItemsMap {
  [key: string]: {
    id: number;
    name: string;
    buyers: { [key: string]: number };
    totalPrice: number;
  };
}

export default function TableReceipt({
  selectedName,
  items,
  setItems,
  isTotalCalculation,
  subtotal,
  total,
  userSubtotal,
  userTotal,
}: TableReceiptProps) {
  const [itemName, setItemName] = useState<string>("");

  return (
    <div className="itemsList">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 850 }} aria-label="simple table">
          <TableBody>
            {isTotalCalculation && (
              <TableRow>
                <TableCell scope="row" align="right" colSpan={6}>
                  Subtotal: {`${userSubtotal} / `} {subtotal}
                </TableCell>
              </TableRow>
            )}

            <TableRows
              selectedName={selectedName}
              items={items}
              setItems={setItems}
            />
            <TableRow>
              <TableCell component="th" scope="row" align="right" colSpan={6}>
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
                      setItems((draft) => {
                        return {
                          ...draft,
                          [itemName]: {
                            id: nextId++,
                            buyers: {},
                            totalPrice: 0,
                          },
                        };
                      });
                    }}
                  >
                    Add
                  </Button>
                </div>
              </TableCell>
            </TableRow>

            {isTotalCalculation && (
              <TableRow>
                <TableCell component="th" scope="row" align="right" colSpan={6}>
                  Total: {`${userTotal} / `}
                  {total}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* left off on making table for tax, tip, other fees, calculating subtotal, calculating total, editing buyer share of other fees, calculating buyer subtotal, calculating buyer total */}
    </div>
  );
}
