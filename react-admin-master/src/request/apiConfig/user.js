import { request } from '../axios';

/**
 * 登陆
 */
export async function login(params) {
    return request('/user/login', params, 'post');
}

/**
 * 注册
 */
 export async function register(params) {
    return request('/user/register', params, 'post');
}

