const regex = /\{\{([^}]+)\}\}/g;

export default class Placeholder {
  static replace(originalString: string, replaceValue: string) {
    return originalString.replace(regex, replaceValue);
  }
  static capitailize(originalString: string) {
    return originalString.replace(regex, (match, captureGroup) => {
      return captureGroup.toUpperCase();
    });
  }
}
