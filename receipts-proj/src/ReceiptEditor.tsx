import { useState } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Button,
  TextField,
} from "@mui/material";

import "./ReceiptEditor.css";

let nextId = 0;
interface StringMap {
  [key: string]: string | number;
}

export default function ReceiptEditor() {
  const [name, setName] = useState("");
  const [names, setNames] = useState<Array<StringMap>>([]);

  const [view, setView] = useState("list");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    setView(nextView);
  };

  return (
    <div id="editor">
      <TextField
        id="outlined-basic"
        label="Add Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={() => {
          setName("");
          setNames([...names, { id: nextId++, name: name }]);
        }}
      >
        Add
      </Button>

      <ToggleButtonGroup
        orientation="vertical"
        size="large"
        exclusive
        value={view}
        onChange={handleChange}
      >
        {names.map((name) => (
          <ToggleButton
            color="primary"
            value={name.name}
            aria-label={name.name as string}
          >
            {name.name}
            <Button
              id={name.name as string}
              onClick={() => {
                setNames(names.filter((n) => n.id !== name.id));
              }}
            >
              Delete
            </Button>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
