import { request } from '../axios';

/**
 * 添加记录
 */
export async function addList({ params, path }) {
  return request('/taskRouter/add', params, 'post', path);
}


/**
 * 获取列表
 */
export async function getList(params) {
  return request('/taskRouter/list', params, 'get');
}

/**
 * 修改
 */
export async function editList({ params, path }) {
  return request('/taskRouter/edit', params, 'post', path);
}

/**
 * 删除
 */
export async function removeList(path) {
  return request('/taskRouter/remove', {}, 'post', path);
}

/**
 * 搜索
 */
export async function searchList({ params }) {
  return request('/taskRouter/search', params, 'post',);
}