import request from './axios';

export function fetchList(data) {
  return request({
    url: '/user/fetchList',
    method: 'get',
    params: data
  });
}

export function deleteUser(data) {
    return request({
    url: '/user/delete',
    method: 'post',
    data
  });
}

export function addUser(data) {
  return request({
    url: '/user/insert',
    method: 'post',
    data: data
  });
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data: data
  });
}

