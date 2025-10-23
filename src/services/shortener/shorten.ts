// @ts-expect-error auto-generated code
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
      // per_page has a default value: 10
      per_page: '10',
      // sort_by has a default value: created_at
      sort_by: 'created_at',
      // order has a default value: desc
      order: 'desc',
      ...params,
    },
    ...(options || {}),
  });
}

/** 添加短网址 添加一个新的短网址 POST /api/shortens */
export async function addShorten(body: API.Shorten, options?: { [key: string]: any }) {
  return request<API.ShortenResponse>('/api/shortens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除短网址列表 批量删除短网址 DELETE /api/shortens */
export async function deleteShorten(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteShortenParams,
  options?: { [key: string]: any },
) {
  return request<void>('/api/shortens', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取短网址信息 通过短码获取短网址信息 GET /api/shortens/${param0} */
export async function getShorten(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: { short_code: string },
  options?: { [key: string]: any },
) {
  const { short_code: param0 } = params;
  return request<API.ShortenResponse>(`/api/shortens/${param0}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新短网址 更新一个短网址 PUT /api/shortens/${param0} */
export async function updateShorten(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateShortenParams,
  body: API.ShortenUpdate,
  options?: { [key: string]: any },
) {
  const { short_code: param0, ...queryParams } = params;
  return request<API.ShortenResponse>(`/api/shortens/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除短网址 删除一个短网址 DELETE /api/shortens/${param0} */
export async function deleteShortenByCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: { short_code: string },
  options?: { [key: string]: any },
) {
  const { short_code: param0 } = params;
  return request<void>(`/api/shortens/${param0}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
