// @ts-expect-error auto-generated code
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取访问历史记录 获取所有访问日志信息 GET /api/histories */
export async function getHistories(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getHistoriesParams,
  options?: { [key: string]: any },
) {
  return request<{ data?: API.HistoryResponse[]; meta?: API.PageMeta }>('/api/histories', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // per_page has a default value: 10
      per_page: '10',
      // sort_by has a default value: accessed_at
      sort_by: 'accessed_at',
      // order has a default value: desc
      order: 'desc',
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除访问日志 批量删除访问日志 DELETE /api/histories */
export async function deleteHistories(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteHistoriesParams,
  options?: { [key: string]: any },
) {
  return request<void>('/api/histories', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
