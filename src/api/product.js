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

export function getProductsByClass(data) {
  return request({
        url: '/product/findByProductClass',
        method: 'get',
        params: data,
        headers: {
            'Content-Type': 'text/plain'
        },
    });
}

