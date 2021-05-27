


// const env = __DEV__ ? 'dev' : 'product';
const ENV = 'dev';

const APPCONFIG = {
  dev: {
    _api_root: 'http://127.0.0.1:3001/api',
  },
  product: {
    _api_root: 'http://www.haiyu.anstjj.cn/api',
  },
};
let apiObj = APPCONFIG[ENV]
export const APIROOT = apiObj._api_root;
export const POWER = '5368421'