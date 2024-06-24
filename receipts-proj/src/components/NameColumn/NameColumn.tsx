import { useState } from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Button,
  TextField,
} from "@mui/material";

import "./NameColumn.css";

let nextId = 0;
interface StringMap {
  [key: string]: string | number;
}

interface NameColumnProps {
  selectedName: string;
  onButtonClick: (value: string) => void;
}

export default function NameColumn({
  selectedName,
  onButtonClick,
}: NameColumnProps) {
  const [currentName, setName] = useState("");
  const [names, setNames] = useState<Array<StringMap>>([]);

  const [view, setView] = useState("list");

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    setView(nextView);
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
          <div key={name.name}>
            <ToggleButton
              className="modifiedButton"
              onClick={() => {
                if (selectedName === name.name) {
                  onButtonClick("");
                } else {
                  onButtonClick(name.name as string);
                }
              }}
              color="primary"
              value={name.name}
              aria-label={name.name as string}
            >
              {name.name}
            </ToggleButton>
            <Button
              id={name.name as string}
              variant="outlined"
              color="error"
              onClick={() => {
                setNames(names.filter((n) => n.id !== name.id));
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
            setName("");
            setNames([...names, { id: nextId++, name: currentName }]);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
