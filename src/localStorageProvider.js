/* eslint-disable no-promise-executor-return */
export default {
  get(key) {
    return new Promise((resolve) => resolve(localStorage.getItem(key)));
  },

  set(key, value) {
    return new Promise((resolve) => resolve(localStorage.setItem(key, value)));
  },
};
