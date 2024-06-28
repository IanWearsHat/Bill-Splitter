export interface ItemsMap {
  [key: string]: {
    id: number;
    buyers: { [key: string]: number };
    totalPrice: number;
  };
}
