import { access, constants } from 'node:fs/promises';

export const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch (err) {
    return false;
  }
};
