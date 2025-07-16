import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { ContentTypeEnum, RequestEnum, ResultEnum } from '@/enums/httpEnum';
import { useUserStore } from '@/store/modules/user';
import { handleError, HttpError, showError } from './error';

// 常量定义
const REQUEST_TIMEOUT = 15000; // 请求超时时间(毫秒)
const LOGOUT_DELAY = 1000; // 退出登录延迟时间(毫秒)
const MAX_RETRIES = 2; // 最大重试次数
const RETRY_DELAY = 1000; // 重试延迟时间(毫秒)

// 扩展 AxiosRequestConfig 类型
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  showErrorMessage?: boolean;
}

const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env;

const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT, // 请求超时时间(毫秒)
  baseURL: VITE_API_URL, // API地址
  withCredentials: VITE_WITH_CREDENTIALS === 'true', // 是否携带cookie，默认关闭
  transformRequest: [data => JSON.stringify(data)], // 请求数据转换为 JSON 字符串
  validateStatus: status => status >= 200 && status < 300, // 只接受 2xx 的状态码
  headers: {
    get: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    post: { 'Content-Type': ContentTypeEnum.JSON }
  },
  transformResponse: [
    (data, headers) => {
      const contentType = headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      }
      return data;
    }
  ]
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const { accessToken } = useUserStore();

    // 设置 token 和 请求头
    if (accessToken) {
      request.headers.set('Authorization', accessToken);
      request.headers.set('Content-Type', ContentTypeEnum.JSON);
    }

    return request;
  },
  (error) => {
    showError(new HttpError('请求配置错误', ResultEnum.ERROR));
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<Api.Http.BaseResponse>) => {
    const { code, msg } = response.data;

    switch (code) {
      case ResultEnum.SUCCESS:
        return response;
      case ResultEnum.OVERDUE:
        logOut();
        throw new HttpError(msg || '未授权，请登录', ResultEnum.OVERDUE);
      default:
        throw new HttpError(msg || '请求失败', code);
    }
  },
  (error) => {
    return Promise.reject(handleError(error));
  }
);

// 请求重试函数
async function retryRequest<T>(
  config: ExtendedAxiosRequestConfig,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await request<T>(config);
  } catch (error) {
    if (retries > 0 && error instanceof HttpError && shouldRetry(error.code)) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRequest<T>(config, retries - 1);
    }
    throw error;
  }
}

// 判断是否需要重试
function shouldRetry(statusCode: number): boolean {
  return [
    ResultEnum.REQUEST_TIMEOUT,
    ResultEnum.ERROR,
    ResultEnum.BAD_GATEWAY,
    ResultEnum.SERVICE_UNAVAILABLE,
    ResultEnum.GATEWAY_TIMEOUT
  ].includes(statusCode);
}

// 请求函数
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
  // 对 POST | PUT 请求特殊处理
  if (config.method?.toUpperCase() === RequestEnum.POST || config.method?.toUpperCase() === RequestEnum.PUT) {
    if (config.params && !config.data) {
      config.data = config.params;
      config.params = undefined;
    }
  }

  try {
    const res = await axiosInstance.request<Api.Http.BaseResponse<T>>(config);
    return res.data.data as T;
  } catch (error) {
    if (error instanceof HttpError) {
      // 根据配置决定是否显示错误消息
      const showErrorMessage = config.showErrorMessage !== false;
      showError(error, showErrorMessage);
    }
    return Promise.reject(error);
  }
}

// API 方法集合
const api = {
  get<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config, method: RequestEnum.GET });
  },
  post<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config, method: RequestEnum.POST });
  },
  put<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config, method: RequestEnum.PUT });
  },
  del<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config, method: RequestEnum.DELETE });
  },
  request<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return retryRequest<T>({ ...config });
  }
};

// 退出登录函数
const logOut = (): void => {
  setTimeout(() => {
    useUserStore().logOut();
  }, LOGOUT_DELAY);
};

export default api;
