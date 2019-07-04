import config from '@/../config/global.config'

const curConfig = config[process.env.NODE_ENV];
const RELEASE_VERSION = curConfig.RELEASE_VERSION || '1.0.0';
let storage = window.localStorage;
let keySurfix = '-' + RELEASE_VERSION;

const setItem = (key, value) => {
  storage.setItem(key.toUpperCase() + keySurfix, value);
}
const getItem = (key) => {
  storage.getItem(key.toUpperCase() + keySurfix);
}
const removeItem = (key) => {
  storage.removeItem(key.toUpperCase()+ keySurfix);
}

export default {
  setItem, getItem, removeItem, RELEASE_VERSION
}
