/**
 * typeOf returns the type of the value passed in.
 *
 * @param value any
 * @returns string
 */
export const typeOf = (value: any): string => {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
