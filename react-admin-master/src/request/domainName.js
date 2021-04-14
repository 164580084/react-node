


// const env = __DEV__ ? 'dev' : 'product';
const ENV = 'dev';

const APPCONFIG = {
  dev: {
    _api_root: 'http://127.0.0.1:3001',
  },
  product: {
    _api_root: 'https://supplier.vodeshop.com/api/',
  },
};
let apiObj = APPCONFIG[ENV]
export const APIROOT = apiObj._api_root;