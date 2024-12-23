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



// 获取商品信息的接口
export function fetchProduct(productid) {
  return request({
    url: '/product/fetchProduct',  // 后端接口路径
    method: 'get',                 // 使用GET请求
    params: {                      // 请求的查询参数
      productid: productid
    }
  });
}