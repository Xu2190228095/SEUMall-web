import request from './axios';

export function search(data) {
  return request({
        url: '/product/findByProductname',
        method: 'get',
        params: data
    });

  return request_id({
         url: '/product/findByProductname',
         method: 'get',
         params: data
    });
}

export function AllList(params) {
    return request({
        url: '/product/list',
        method: 'get',
        params
    });
}

export function fetchList(params) {
    return request({
        url: '/product/fetchList',
        method: 'get',
        params
    });
}

export function deleteProduct(params) {
    return request({
        url: '/product/deleteProduct',
        method: 'post',
        data: params
    });
}

export function updateProductStatus(params) {
    return request({
        url: '/product/updateProductStatus',
        method: 'post',
        data: params
    });
}