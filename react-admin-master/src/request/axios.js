/**
 * Created by WebStorm.
 * User: AnstJJ
 * Date: 2020/3/26
 * Time: 3:23 下午
 */

import axios from 'axios';
import { message, Button } from 'antd';
import { APIROOT } from './domainName';
//  import AsyncStorage from '../util/asyncStorage';
const instance = axios.create({
    baseURL: APIROOT,
    timeout: 10000, //超时时间
    retry: 3, //请求次数
    retryDelay: 1000, //请求间隙
    headers: {
        'Content-Type': 'application/json',
        'X-Request-From': 'app',
        Authorization: 'Bearer ',
    },
});
// 添加一个请求拦截器
instance.interceptors.request.use(
    async function (config) {
        //网络请求
        // return config;
        // NetInfoStateType
        // NetInfo.fetch().then(state => {
        //   console.log(state);
        //   if (state.type == 'none') {
        //     console.log('跳转到没网页面');
        //     return;
        //   }
        // });
        // 在发送请求之前做些什么
        //  let token_type = await AsyncStorage.get('token_type');
        //  token_type != null
        //    ? (config.headers.Authorization =
        //        token_type.token_type + ' ' + token_type.access_token)
        //    : 'Bearer ';
        return config;
    },
    function (error) {
        console.log(error);
        // Do something with request error
        return Promise.reject(error);
    },
);

// 添加一个响应拦截器
instance.interceptors.response.use(
    function (response) {
        console.log(response);
        return response;
    },
    function (err) {
        console.log(err);
        const { message, code, response } = err;
        console.log(response);
        //请求超时
        if (code === 'ECONNABORTED' || message === 'Network Error') {
            message.warning('请求超时后重试');
        } else {
            console.log(err);
            dealError(err.response.status);
        }
    },
);

/**
 * 错误处理
 * @param status 状态码
 */
function dealError(status) {
    switch (status) {
        case 401:
            message.error('401');
            break;
        case 500:
            message.error('服务器忙');
            break;
    }
}

/**
 * 公用路由的请求
 * @param api
 * @param params
 * @param methods
 * @param path
 * @returns {Promise<unknown>}
 */
export const request = async (api, params = {}, methods = 'get', path = '') => {
    api += path;
    console.log(api);
    console.log(params);
    /**
     * 过滤为空的字段
     */
    for (let key in params) {
        if (
            params.hasOwnProperty(key) &&
            params[key] != 0 &&
            (params[key] == null ||
                params[key] == undefined ||
                params[key] == 'undefined' ||
                params[key] == '')
        ) {
            delete params[key];
        }
    }
    console.log(params);
    if (methods === 'get') {
        for (let key in params) {
            const isFirst = api.indexOf('?') < 0;
            // if()
            api += isFirst ? `?${key}=${params[key]}` : `&${key}=${params[key]}`;
        }
        params = {};
    }
    console.log(`${APIROOT}` + api, 'last');
    return new Promise(resolve => {
        instance[methods](api, params)
            .then(res => {
                if (res && res.status == 200) {
                    resolve(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
    });
};
