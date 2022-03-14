export const onWaitFor = (second: number): Promise<boolean> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, second * 1000);
  });
