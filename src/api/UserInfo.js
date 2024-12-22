import request from './axios';

export function login(data) {
    return request.get('/user/list', data);
}

export function user_info() {
    return request({
        url: '/user/list',
        method: 'get',
    })
}