import { ItemsMap } from "./ItemsMap";

export interface FormMap {
  receiptName: string;
  buyers: Array<Array<string | number>>;
  items: Array<{ [key: string]: string | number }>;
  finalItems: Array<{ [key: string]: string | number }>;
}

function _createItemsList(
  items: ItemsMap,
  buyersToPrices: { [key: string]: number }
) {
  const itemsArr: Array<{
    [key: string]: number | string;
  }> = [];
  Object.entries(items).map(([itemName, itemData]) => {
    itemsArr.push({
      name: itemName,
      totalPrice: itemData.totalPrice,
      ...itemData.buyers,
    });

    // Adds total from this item for that buyer
    Object.entries(itemData.buyers).map(([buyerName, amountOwed]) => {
      buyersToPrices[buyerName] += amountOwed;
    });
  });
  return itemsArr;
}

export function createFormData(
  receiptName: string,
  names: Array<Array<string | number>>,
  items: ItemsMap,
  lastItems: ItemsMap
) {
  const receipt: FormMap = {
    receiptName: receiptName,
    buyers: [],
    items: [],
    finalItems: [],
  };

  const buyersToPrices: { [key: string]: number } = {};
  names.map((name) => {
    buyersToPrices[name[0]] = 0;
  });

  receipt.items = _createItemsList(items, buyersToPrices);
  receipt.finalItems = _createItemsList(lastItems, buyersToPrices);

  const buyersList: Array<Array<string | number>> = [];
  Object.entries(buyersToPrices).map(([name, amountOwed]) => {
    buyersList.push([name, amountOwed]);
  });
  receipt.buyers = buyersList;

  return receipt;
}

export function convertItemsObject(items: Array<{ [key: string]: string | number }>) {
  const itemsObj: ItemsMap = {};
  for (let i = 0; i < items.length; i++) {
    const { name, totalPrice, ...restItems } = items[i];

    itemsObj[name] = {
      id: i,
      buyers: { ...restItems } as {
        [key: string]: number;
      },
      totalPrice: totalPrice as number,
    };
  }
  console.log(itemsObj);
  return itemsObj;
}
