// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录接口 POST /api/account/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/account/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/account/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<any>('/api/account/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取当前的用户 GET /api/users/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/users/current', {
    method: 'GET',
    ...(options || {}),
  });
}
