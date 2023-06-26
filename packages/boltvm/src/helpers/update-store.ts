import { IMetadata } from "../typings/metadata";
import { getStore } from "./get-store";

export const updateStore = async (
  key: string,
  value: string,
  data: IMetadata
) => {
  const store = await getStore();
  const storeData = store.get(key) || {};

  storeData[value] = data;

  // update the store
  store.set(key, storeData);

  store.save();
};
