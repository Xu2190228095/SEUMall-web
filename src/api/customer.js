import request from './axios';

export function auth(data) {
  return request({
        url: '/authenticate/customer',
        method: 'get',
        params: data
    });
}

export function login(data) {
  return request({
        url: '/authenticate/CustomerLogin',  
        method: 'post',
        data: data,
    });
}

export function register(data) {
  return request({
        url: '/authenticate/CustomerRegister',
        method: 'post',
        data: data
    });
}