import request from './axios';

export function login(data) {
  return request({
        url: '/authenticate/user',
        method: 'get',
        params: data
    });
}

export function userlist () {
  return request({
        url: '/user/list',
        method: 'get'
    });
}