import request from './axios';

export function AllList(url) {
    return request({
        url: '/image/list',
        method: 'get',
        params:url
    });
}

