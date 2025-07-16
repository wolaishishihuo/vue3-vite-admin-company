import type { AxiosError } from 'axios';
import { ElMessage } from 'element-plus';
import { ResultEnum } from '@/enums/httpEnum';

// 错误响应接口
export interface ErrorResponse {
  code: number;
  msg: string;
  data?: unknown;
}

// 错误日志数据接口
export interface ErrorLogData {
  code: number;
  message: string;
  data?: unknown;
  timestamp: string;
  url?: string;
  method?: string;
  stack?: string;
}

// 自定义 HttpError 类
export class HttpError extends Error {
  public readonly code: number;
  public readonly data?: unknown;
  public readonly timestamp: string;
  public readonly url?: string;
  public readonly method?: string;

  constructor(
    message: string,
    code: number,
    options?: {
      data?: unknown;
      url?: string;
      method?: string;
    }
  ) {
    super(message);
    this.name = 'HttpError';
    this.code = code;
    this.data = options?.data;
    this.timestamp = new Date().toISOString();
    this.url = options?.url;
    this.method = options?.method;
  }

  public toLogData(): ErrorLogData {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
      url: this.url,
      method: this.method,
      stack: this.stack
    };
  }
}

/**
 * 获取错误消息
 * @param status 错误状态码
 * @returns 错误消息
 */
const getErrorMessage = (status: number): string => {
  const errorMap: Record<number, string> = {
    [ResultEnum.OVERDUE]: '未授权，请登录',
    [ResultEnum.FORBIDDEN]: '无权限访问',
    [ResultEnum.NOT_FOUND]: '请求的资源不存在',
    [ResultEnum.METHOD_NOT_ALLOWED]: '请求方法不允许',
    [ResultEnum.REQUEST_TIMEOUT]: '请求超时',
    [ResultEnum.ERROR]: '服务器内部错误',
    [ResultEnum.BAD_GATEWAY]: '网关错误',
    [ResultEnum.SERVICE_UNAVAILABLE]: '服务不可用',
    [ResultEnum.GATEWAY_TIMEOUT]: '网关超时'
  };

  return errorMap[status] || '服务器内部错误';
};

// eslint-disable-next-line jsdoc/require-returns-check
/**
 * 处理错误
 * @param error 错误对象
 * @returns 错误对象
 */
export function handleError(error: AxiosError<ErrorResponse>): never {
  // 处理取消的请求
  if (error.code === 'ERR_CANCELED') {
    console.warn('Request cancelled:', error.message);
    throw new HttpError('请求已取消', ResultEnum.ERROR);
  }

  const statusCode = error.response?.status;
  const errorMessage = error.response?.data?.msg || error.message;
  const requestConfig = error.config;

  // 处理网络错误
  if (!error.response) {
    throw new HttpError('网络错误，请检查网络连接', ResultEnum.ERROR, {
      url: requestConfig?.url,
      method: requestConfig?.method?.toUpperCase()
    });
  }

  // 处理 HTTP 状态码错误
  const message = statusCode
    ? getErrorMessage(statusCode)
    : errorMessage || '请求失败';
  throw new HttpError(message, statusCode || ResultEnum.ERROR, {
    data: error.response.data,
    url: requestConfig?.url,
    method: requestConfig?.method?.toUpperCase()
  });
}

/**
 * 显示错误消息
 * @param error 错误对象
 * @param showMessage 是否显示错误消息
 */
export function showError(error: HttpError, showMessage: boolean = true): void {
  if (showMessage) {
    ElMessage.error(error.message);
  }
  // 记录错误日志
  console.error('[HTTP Error]', error.toLogData());
}

/**
 * 判断是否为 HttpError 类型
 * @param error 错误对象
 * @returns 是否为 HttpError 类型
 */
export const isHttpError = (error: unknown): error is HttpError => {
  return error instanceof HttpError;
};
