export const classes = (...args) => {
  const classList = [];

  for (const arg of args) {
    if (Array.isArray(arg)) {
      classList.push(...arg);
    } else if (typeof arg === "object" && arg != null) {
      for (const key in arg) {
        if (arg[key]) classList.push(key);
      }
    } else {
      classList.push(arg);
    }
  }

  return classList.join(" ");
};
