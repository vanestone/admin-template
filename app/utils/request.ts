import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { filterValidHeaders, isValidHeaderName } from './index';

// 创建 axios 实例
const request = axios.create({
  timeout: 30000,
  withCredentials: true,
});

// 请求拦截器 - 过滤无效的 header
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 过滤掉无效的 headers，防止 "Invalid name" 错误
    if (config.headers) {
      const validHeaders: Record<string, string> = {};

      for (const [name, value] of Object.entries(config.headers)) {
        // 跳过 axios 内部的 common, get, post 等配置
        if (['common', 'delete', 'get', 'head', 'post', 'put', 'patch'].includes(name)) {
          // 递归处理嵌套的 header 配置
          if (typeof value === 'object' && value !== null) {
            const nestedHeaders: Record<string, string> = {};
            for (const [nestedName, nestedValue] of Object.entries(value as Record<string, unknown>)) {
              if (isValidHeaderName(nestedName) && nestedValue != null && nestedValue !== '') {
                nestedHeaders[nestedName] = String(nestedValue);
              } else if (!isValidHeaderName(nestedName) && nestedName !== '') {
                console.warn(`[Request] 无效的 header 名称被过滤: "${nestedName}"`);
              }
            }
            validHeaders[name] = nestedHeaders as unknown as string;
          }
          continue;
        }

        if (isValidHeaderName(name) && value != null && value !== '') {
          validHeaders[name] = String(value);
        } else if (!isValidHeaderName(name) && name !== '') {
          console.warn(`[Request] 无效的 header 名称被过滤: "${name}"`);
        }
      }

      config.headers = validHeaders as AxiosRequestConfig['headers'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    const message = error.response?.data?.message || error.message || '请求失败';
    console.error('[Request Error]', message);
    return Promise.reject(error);
  }
);

export default request;
