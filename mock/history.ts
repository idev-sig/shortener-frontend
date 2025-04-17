import { Request, Response } from 'express';
import { parse } from 'url';
import Mock, { Random } from 'mockjs';

const siteUrl = 'http://localhost:8000';

/**
 * Generates a mock list of shortened URL data for pagination
 * @param current - Current page number
 * @param pageSize - Number of items per page
 * @returns Array of mock shortened URL items with random data including id, code,
 * short_url, original_url, description, status and timestamps
 */
const genList = (current: number, pageSize: number) => {
  return Mock.mock({
    'list|50': [
      {
        'id|+1': 1, // 自增 ID
        'url_id|1-100': 1, // 短链接 ID（1-100随机）
        short_code: '@word(5,8)', // 5-8位短码
        ip_address: '@ip', // IPv4 地址
        user_agent: '@string(16,32)', // 浏览器 UA
        referer: function () {
          const shortCode = this.short_code;
          return Random.pick([
            `https://google.com?q=${shortCode}`,
            `https://baidu.com?q=${shortCode}`,
          ]);
        },
        country: '@country', // 国家（如 "中国"）
        region: '@region', // 地区（如 "华东"）
        province: '@province', // 省份（如 "广东省"）
        city: '@city', // 城市（如 "深圳市"）
        isp: '@ctitle(4,8)', // 运营商（如 "中国电信"）
        'device_type|1': ['pc', 'mobile', 'tablet'], // 设备类型
        'os|1': ['Windows', 'MacOS', 'Linux', 'Android', 'iOS'], // 操作系统
        'browser|1': ['Chrome', 'Firefox', 'Safari', 'Edge'], // 浏览器
        accessed_time: '@datetime', // 访问时间（如 "2024-03-20 12:00:00"）
        created_time: '@datetime', // 创建时间
      },
    ],
  }).list.map((item: any) => {
    return item as API.HistoryResponse;
  });
};

let tableListDataSource: API.HistoryResponse[] = genList(1, 100);

/**
 * Handles the request for history records with pagination, sorting and filtering capabilities
 *
 * @param req - Express Request object containing query parameters
 * @param res - Express Response object to send JSON response
 * @param u - URL string parameter (optional)
 *
 * @returns JSON response containing:
 * - data: Filtered and sorted history records
 * - meta: Pagination metadata including:
 *   - page: Current page number
 *   - page_size: Number of items per page
 *   - current_count: Number of items in current page
 *   - total_items: Total number of items
 *   - total_pages: Total number of pages
 *
 * Supports filtering by:
 * - short_code
 * - device_type
 * - os
 */
function getHistorys(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { page = 1, page_size = 10 } = req.query;
  const params = parse(realUrl, true).query as unknown as API.PageParams &
    API.HistoryResponse & {
      sorter: any;
      filter: any;
    };

  // console.log('params', params);

  const pageInt: number = parseInt(page as string);
  const pageSizeInt: number = parseInt(page_size as string);
  let dataSource = [...tableListDataSource].slice(
    (pageInt - 1) * pageSizeInt,
    pageInt * pageSizeInt,
  );
  if (params.sorter) {
    const sorter = JSON.parse(params.sorter);
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      (Object.keys(sorter) as Array<keyof API.HistoryResponse>).forEach((key) => {
        let nextSort = next?.[key] as number;
        let preSort = prev?.[key] as number;
        if (sorter[key] === 'descend') {
          if (preSort - nextSort > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }
          return;
        }
        if (preSort - nextSort > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }
  if (params.filter) {
    const filter = JSON.parse(params.filter as any) as {
      [key: string]: string[];
    };
    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return (Object.keys(filter) as Array<keyof API.HistoryResponse>).some((key) => {
          if (!filter[key]) {
            return true;
          }
          if (filter[key].includes(`${item[key]}`)) {
            return true;
          }
          return false;
        });
      });
    }
  }

  if (params.short_code) {
    dataSource = dataSource.filter((data) => data?.short_code?.includes(params.short_code || ''));
  }
  if (params.device_type) {
    dataSource = dataSource.filter((data) => data?.device_type?.includes(params.device_type || ''));
  }
  if (params.os) {
    dataSource = dataSource.filter((data) => `${data?.os}`.includes(`${params.os}` || ''));
  }

  const result = {
    data: dataSource,
    meta: {
      page: pageInt,
      page_size: pageSizeInt,
      current_count: dataSource.length,
      total_items: tableListDataSource.length,
      total_pages: Math.ceil(tableListDataSource.length / pageSizeInt),
    },
  };
  return res.json(result);
}

/**
 * Deletes a history record by ID from the data source
 * @param req - Express request object containing the ID parameter
 * @param res - Express response object
 * @param u - URL string parameter
 * @param b - Request object parameter
 * @returns void - Responds with 204 status code and empty JSON
 */
function deleteHistory(req: Request, res: Response, u: string, b: Request) {
  const { id } = req.params;
  const idNumber = parseInt(id as string);

  tableListDataSource = tableListDataSource.filter((item) => idNumber !== item.id);

  res.status(204).json({});
}

/**
 * Deletes multiple history records by ID from the data source
 * @param req - Express request object containing the ID parameter
 * @param res - Express response object
 * @param u - URL string parameter
 * @param b - Request object parameter
 * @returns void - Responds with 204 status code and empty JSON
 */
function deleteHistorys(req: Request, res: Response, u: string, b: Request) {
  const { ids } = req.query;
  const idArray = (ids as string).split(',') || [];

  if (idArray.length === 0) {
    res.status(400).json({ errcode: 400, errinfo: 'ids is required' });
    return;
  }

  tableListDataSource = tableListDataSource.filter((item) => idArray.indexOf(`${item.id}`) === -1);
  res.status(204).json({});
}

export default {
  'GET /api/histories': getHistorys,
  'DELETE /api/histories/:id': deleteHistory,
  'DELETE /api/histories': deleteHistorys,
};
