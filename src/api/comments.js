import request from './axios';

export function findByPid(productId) {
    return request({
        url: '/comments/findByPid',
        method: 'get',
        params: { pid: productId }  // 传递参数时需要把参数作为对象传递
    });
}