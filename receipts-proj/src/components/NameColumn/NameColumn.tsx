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
  onButtonClick: (value: string) => void;
}

export default function NameColumn({
  selectedName,
  onButtonClick,
}: NameColumnProps) {
  const [currentName, setName] = useState("");
  const [names, setNames] = useState<Array<string>>([]);
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
          <div key={name}>
            <ToggleButton
              className="modifiedButton"
              onClick={() => {
                if (selectedName === name) {
                  onButtonClick("");
                } else {
                  onButtonClick(name);
                }
              }}
              color="primary"
              value={name}
              aria-label={name}
            >
              {name}
            </ToggleButton>
            <Button
              id={name}
              variant="outlined"
              color="error"
              onClick={() => {
                setNames(names.filter((n) => n !== name));
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
            if (names.includes(currentName)) {
              setOpen(true);
            } else {
              setName("");
              setNames([...names, currentName]);
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
