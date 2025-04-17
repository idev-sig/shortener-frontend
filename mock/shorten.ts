import { Request, Response } from 'express';
import { parse } from 'url';
import { Random } from 'mockjs';

const siteUrl = 'http://localhost:8000';

/**
 * Generates a mock list of shortened URL data for pagination
 * @param current - Current page number
 * @param pageSize - Number of items per page
 * @returns Array of mock shortened URL items with random data including id, code,
 * short_url, original_url, description, status and timestamps
 */
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: API.ShortenResponse[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i + 1;
    const code = Random.word(6, 8);
    tableListDataSource.push({
      id: index,
      code: code,
      short_url: `${siteUrl}/?${code}`,
      original_url: Random.url('http', 'baidu.com?'),
      describe: `这是一段描述: ${index}`,
      status: Math.floor(Math.random() * 10) % 3,
      created_at: Random.now('second'),
      updated_at: Random.now('second'),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource: API.ShortenResponse[] = genList(1, 100);

/**
 * 获取短链列表
 *
 * @param req 请求对象
 * @param res 响应对象
 * @param u 用户提供的URL字符串，若为空则使用请求中的URL
 * @returns 响应结果
 */
function getShortens(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { page = 1, page_size = 10 } = req.query;
  const params = parse(realUrl, true).query as unknown as API.PageParams &
    API.ShortenResponse & {
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
      (Object.keys(sorter) as Array<keyof API.ShortenResponse>).forEach((key) => {
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
        return (Object.keys(filter) as Array<keyof API.ShortenResponse>).some((key) => {
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

  if (params.code) {
    dataSource = dataSource.filter((data) => data?.code?.includes(params.code || ''));
  }
  if (params.original_url) {
    dataSource = dataSource.filter((data) =>
      data?.original_url?.includes(params.original_url || ''),
    );
  }
  if (params.status) {
    dataSource = dataSource.filter((data) => `${data?.status}`.includes(`${params.status}` || ''));
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
 * Handles POST request to create a shortened URL
 * @param req - Express Request object
 * @param res - Express Response object
 * @param u - URL string parameter
 * @param b - Request body parameter
 * @returns Response with the newly created shortened URL object
 *
 * Creates a new shortened URL entry with either provided or random code.
 * Adds the entry to tableListDataSource and returns the created object.
 */
function postShorten(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { code, original_url, describe } = body;

  const newCode = code || Random.word(6, 8);
  const newShorten: API.ShortenResponse = {
    id: tableListDataSource.length + 1,
    code: newCode,
    short_url: `${siteUrl}/?${newCode}`,
    original_url,
    describe,
    status: Math.floor(Math.random() * 10) % 3,
    created_at: Random.now('second'),
    updated_at: Random.now('second'),
  };
  tableListDataSource.unshift(newShorten);
  return res.json(newShorten);
}

/**
 * Updates a shorten URL record in the table list data source
 *
 * @param req - Express request object containing URL parameters
 * @param res - Express response object for sending JSON response
 * @param u - Real URL string (optional)
 * @param b - Request object containing body data (optional)
 * @returns JSON response with updated shorten URL record
 *
 * @description
 * Takes an ID parameter and request body containing original_url and describe.
 * Updates the matching record in tableListDataSource and returns the updated item.
 */
function putShorten(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body: any = (b && b.body) || req.body;
  const { id } = req.params;
  const { original_url, describe } = body;

  const idNumber = parseInt(id as string);
  let newShorten = {} as API.ShortenResponse;
  tableListDataSource = tableListDataSource.map((item) => {
    if (item.id === idNumber) {
      newShorten = { ...item, original_url, describe };
      return { ...item, original_url, describe };
    }
    return item;
  });
  return res.json(newShorten);
}

/**
 * Deletes a shortened URL record by its ID
 * @param req - Express request object containing the ID parameter
 * @param res - Express response object
 * @param u - URL string parameter (unused)
 * @param b - Additional request object (unused)
 * @returns void - Sends 204 status with empty response on success
 */
function deleteShorten(req: Request, res: Response, u: string, b: Request) {
  const { id } = req.params;
  const idNumber = parseInt(id as string);

  tableListDataSource = tableListDataSource.filter((item) => idNumber !== item.id);

  res.status(204).json({});
}

/**
 * Delete multiple shortened URLs by their IDs
 * @param req - Express request object containing query parameter 'ids'
 * @param res - Express response object
 * @param u - URL string parameter (unused)
 * @param b - Additional request object (unused)
 *
 * @returns void - Sends HTTP 204 on success, 400 if ids are missing
 *
 * @description
 * Accepts comma-separated IDs in query parameter.
 * Filters out matching items from tableListDataSource.
 * Returns 400 if no IDs provided.
 */
function deleteShortens(req: Request, res: Response, u: string, b: Request) {
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
  'GET /api/shortens': getShortens,
  'POST /api/shortens': postShorten,
  'PUT /api/shortens/:id': putShorten,
  'DELETE /api/shortens/:id': deleteShorten,
  'DELETE /api/shortens': deleteShortens,
};
