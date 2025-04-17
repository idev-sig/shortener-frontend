// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取所有短址信息 获取所有短址信息 GET /api/shortens */
export async function getShortens(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getShortensParams,
  options?: { [key: string]: any },
) {
  return request<{ data?: API.ShortenResponse[]; meta?: API.PageMeta }>('/api/shortens', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // page_size has a default value: 10
      page_size: '10',
      // sort_by has a default value: created_at
      sort_by: 'created_at',
      // order has a default value: desc
      order: 'desc',
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加短网址 添加一个新的短网址 返回值: 未知错误 POST /api/shortens */
export async function addShorten(body: API.Shorten, options?: { [key: string]: any }) {
  return request<API.Error>('/api/shortens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除短网址列表 删除短网址列表 返回值: 未知错误 DELETE /api/shortens */
export async function deleteShorten(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteShortenParams,
  options?: { [key: string]: any },
) {
  return request<API.Error>('/api/shortens', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新短网址 更新一个短网址 返回值: 未知错误 PUT /api/shortens/${param0} */
export async function updateShorten(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateShortenParams,
  body: API.ShortenUpdate,
  options?: { [key: string]: any },
) {
  const { code: param0, ...queryParams } = params;
  return request<API.Error>(`/api/shortens/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
