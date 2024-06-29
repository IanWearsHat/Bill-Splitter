import { createContext } from "react";
import { ItemsMap } from "./ItemsMap";

interface ContextMap {
  selectedName: string;
  setSelectedName: (value: string) => void;
  names: Array<Array<string | number>>;
  setNames: (value: Array<Array<string | number>>) => void;
  items: ItemsMap;
  setItems: (updater: (draft: ItemsMap) => void) => void;
  lastItems: ItemsMap;
  setLastItems: (updater: (draft: ItemsMap) => void) => void;
}

export const ObjectContext = createContext({} as ContextMap);
