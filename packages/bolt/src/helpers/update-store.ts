import getStore from "./get-store";

export const updateStore = async (key: string, value: string, data?: any) => {
  const store = await getStore();

  const storeData = store.get(key) || {};

  let found = false;

  if (!data) {
    store.set(key, value);
    store.save();
    return;
  }

  // check if service already exists, if yes, update it
  if (storeData[value]) {
    found = true;
    storeData[value] = data;
  }

  // if not, add it
  if (!found) {
    storeData[value] = data;
  }

  // update the store
  store.set(key, storeData);

  store.save();
};
