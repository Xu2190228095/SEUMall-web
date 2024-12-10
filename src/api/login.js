import request from './axios';

export function login(data) {
  return request.get('/dept/list', data);
}