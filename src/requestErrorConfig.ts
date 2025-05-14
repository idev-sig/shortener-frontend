import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      // console.log('errorThrower:', res);
      const { errcode, errinfo } = res as unknown as API.ErrorResponse;
      if (errcode && errinfo) {
        const error: any = new Error(errinfo);
        error.name = 'BizError';
        error.info = { errcode, errinfo };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      // console.log('errorHandler:', error, opts);
      // console.log('errorHandler:', error);
      if (opts?.skipErrorHandler) throw error;
      if (error.name === 'BizError') {
        console.error('BizError:', error);
        const errorInfo: API.ErrorResponse | undefined = error.info;
        if (errorInfo) {
          const { errinfo } = errorInfo;
          message.error(errinfo);
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // console.log('请求拦截器:', config);
      // 拦截请求配置，进行个性化处理。
      // const url = config?.url?.concat('?token = 123');
      const url = config?.url;
      const headers = config?.headers;
      const token = localStorage.getItem('token');
      if (token && headers && token !== '') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      return { ...config, url };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      // console.log('响应拦截器:', response);
      // 拦截响应数据，进行个性化处理
      const { errcode, errinfo } = response as unknown as API.ErrorResponse;

      if (errcode && errinfo) {
        message.error('请求失败！');
      }
      return response;
    },
  ],
};
