import { unlink } from "fs/promises";

export const removefile = async (filepath: string) => {
  try {
    await  unlink(filepath);
  } catch (err) {
    return Promise.resolve(false);
  }
  return Promise.resolve(true);
};
