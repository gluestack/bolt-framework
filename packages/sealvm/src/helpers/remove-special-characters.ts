export const removeSpecialCharacters = (str: string) => {
  const regex = /[^a-zA-Z0-9 ]/g;
  str = str.replace(regex, "");
  return str;
};
