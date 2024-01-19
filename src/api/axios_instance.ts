// axiosConfig.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-react';

interface CustomAxiosResponse<T = any> extends AxiosResponse {
  data: T;
}

interface CustomAxiosError<T = any> {
  response?: CustomAxiosResponse<T>;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api', // 你的API的基本URL
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    // 你可能还想在这里添加其他全局头部信息
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在请求发送之前做一些处理

    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        token: token,
      };
    }

    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: CustomAxiosResponse) => {
    const resp = response.data;

    // 在响应返回之后做一些处理
    if (resp.resultCode === 200) {
      return resp;
    }

    if (resp.resultCode === 500) {
      if(resp.resultMessage){
        Message.error(resp.resultMessage);
      } else  {
        Message.error('网络异常！');
      }
      return resp;
    }

    // if (resp.resultCode === 10001) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('userStatus');
    //   window.location.href = '/login';
    //   Message.info('登录过期');
    //   return;
    // } else {
    //   Message.error(resp.resultMessage);
    // }

    return response;
  },
  (error: CustomAxiosError) => {
    // if (error.response.status === 500) {
    //   window.location.href = '/exception/404';
    // }
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default axiosInstance;
