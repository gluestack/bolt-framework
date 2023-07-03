import getStore from "./get-store";

export const getStoreData = async (key: string) => {
  const store = await getStore();
  const data = store.get(key) || [];
  return data;
};
