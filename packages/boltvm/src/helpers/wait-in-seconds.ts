export const waitInSeconds = async (seconds: number) => {
  setTimeout(async () => {
    return Promise.resolve(true);
  }, seconds * 1000);
};
