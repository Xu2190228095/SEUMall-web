import request from './axios';

export function auth(data) {
  return request({
        url: '/authenticate/user',
        method: 'get',
        params: data
    });
}

export function login(data) {
  return request({
        url: '/authenticate/login',  
        method: 'post',
        data: data
    });
}

export function register(data) {
  return request({
        url: '/authenticate/register',
        method: 'post',
        data: data
    });
}

export function userlist () {
  return request({
        url: '/user/list',
        method: 'get'
    });
}