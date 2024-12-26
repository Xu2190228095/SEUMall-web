import request from './axios_c';

export function getAddressesByCid(cid) {
    return request({
        url: `/address/byCid/${cid}`,  // 查询某个顾客的地址
        method: 'get',
        params: {                      // 请求的查询参数
            cid: cid
          }
    });
}

export function addAddress(addressData) {
    return request({
      url: '/address/add',  // 添加新地址的接口
      method: 'post',
      data: addressData
    });
}
  

export function deleteAddress(addressId) {
    return request({
      url: `/address/delete/${addressId}`,  // 删除地址的接口
      method: 'delete',
      params: {                      // 请求的查询参数
        addressId: addressId
      }
    });
}
  
// 获取用户信息接口
export function getCustomerByCid(id) {
  return request({
      url: `/customer/get/${id}`,  // 根据 id 获取用户信息
      method: 'get',
      params: {                      // 请求的查询参数
          id: id
      }
  });
}

// 更新用户信息接口
export function updateCustomer(userData) {
  return request({
      url: '/customer/update',  // 更新用户信息接口
      method: 'post',
      data: userData  // 用户信息（username, account, email, password）
  });
}
  
  