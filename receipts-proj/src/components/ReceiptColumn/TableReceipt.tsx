import {
  Alert,
  Button,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";

import TableRows from "./TableRows";
import { ItemsMap } from "../ReceiptEditor/ItemsMap";
import "./ReceiptColumn.css";
import { IsReadOnlyContext } from "../ReceiptEditor/IsReadOnlyContext";

let nextId = 0;
interface TableReceiptProps {
  selectedName: string;
  items: ItemsMap;
  setItems: (updater: (draft: ItemsMap) => void) => void;
  isTotalCalculation?: boolean;
  subtotal?: number;
  total?: number;
  userSubtotal?: number;
  userTotal?: number;
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

  const [open, setOpen] = useState(false);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const isReadOnly = useContext(IsReadOnlyContext);

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
              isReadOnly={isReadOnly}
              selectedName={selectedName}
              items={items}
              setItems={setItems}
            />

            {!isReadOnly && (
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
                        if (itemName in items) {
                          setOpen(true);
                        } else {
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
                          setItemName("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

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

      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert variant="filled" onClose={handleClose} severity="error">
          Error: Item already exists in receipt
        </Alert>
      </Snackbar>
    </div>
  );
}
