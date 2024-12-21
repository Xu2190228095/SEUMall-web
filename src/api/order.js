import request from './axios';

export function fetchList(params) {
  return request({
    url: '/order/fetchList',
    method: 'get',
    params
  });
}

export function deleteOrder(params) {
  return request({
    url: '/order/deleteOrder',
    method: 'post',
    data: params
  });
}

export function updateOrderStatus(params) {
  return request({
    url: '/order/updateOrderStatus',
    method: 'post',
    data: params
  });
}
