import request from './axios';

export function login(data) {
    return request.get('/user/list', data);
}