import { useState } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

import "./NameColumn.css";

interface NameColumnProps {
  selectedName: string;
  names: Array<Array<string | number>>;
  setNames: (value: Array<Array<string | number>>) => void;
  onButtonClick: (value: string) => void;
}

export default function NameColumn({
  selectedName,
  names,
  setNames,
  onButtonClick,
}: NameColumnProps) {
  const [currentName, setName] = useState("");

  const [open, setOpen] = useState(false);
  const [view, setView] = useState("list");

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    setView(nextView);
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function valueInArray(value: string, arr: Array<Array<string | number>>) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] == value) return true;
    }
    return false;
  }

  return (
    <div id="nameColumn">
      <ToggleButtonGroup
        orientation="vertical"
        size="large"
        exclusive
        value={view}
        onChange={handleChange}
      >
        {names.map((name) => (
          <div key={name[0]}>
            <ToggleButton
              className="modifiedButton"
              onClick={() => {
                if (selectedName === name[0]) {
                  onButtonClick("");
                } else {
                  onButtonClick(name[0] as string);
                }
              }}
              color="primary"
              value={name[0] as string}
              aria-label={name[0] as string}
            >
              {name[0]}
            </ToggleButton>
            <Button
              id={name[0] as string}
              variant="outlined"
              color="error"
              onClick={() => {
                setNames(names.filter((n) => n[0] !== name[0]));
              }}
            >
              Delete
            </Button>
          </div>
        ))}
      </ToggleButtonGroup>

      <div id="addNameGroup">
        <TextField
          id="outlined-basic"
          label="Add Name"
          variant="outlined"
          value={currentName}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            if (valueInArray(currentName, names)) {
              setOpen(true);
            } else {
              setName("");
              setNames([...names, [currentName, 0]]);
            }
          }}
        >
          Add
        </Button>
      </div>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert variant="filled" onClose={handleClose} severity="error">
          Error: Name already exists
        </Alert>
      </Snackbar>
    </div>
  );
}
