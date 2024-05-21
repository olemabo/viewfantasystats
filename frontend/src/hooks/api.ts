import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import merge from 'lodash.merge';

export type OkResponse<T> = {
  success: true;
  data: T;
  statusCode?: number;
  error: undefined;
};

export type ErrorResponse<T = unknown> = {
  success: false;
  data: undefined;
  statusCode?: number;
  error: ApiError<T>;
};

type ApiError<T> = {
  errors?: { [k in keyof T]?: string[] };
};

export type ApiResponse<TResponse, TData = unknown> = OkResponse<TResponse> | ErrorResponse<TData>;

const makeOkResponse = <T>(response: AxiosResponse<T>): OkResponse<T> => ({
  success: true,
  data: response.data,
  statusCode: response.status,
  error: undefined,
});

const makeErrorResponse = <T>(response?: AxiosResponse<T>): ErrorResponse<T> => ({
  success: false,
  data: undefined,
  statusCode: response?.status,
  error: response?.data ? response?.data : { errors: undefined },
});

const defaultAxiosConfig = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
};

export const get = async <TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<TResponse>> => {
  return await axios
    .get<TResponse>(url, merge(defaultAxiosConfig, config))
    .then((response) => {
      return makeOkResponse(response);
    })
    .catch((err: AxiosError<ApiError<unknown>>) => {
      return makeErrorResponse(err.response);
    });
};

export const post = async <TResponse, TData>(
  url: string,
  data: TData,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<TResponse, TData>> => {
  return await axios
    .post<TData, AxiosResponse<TResponse>>(url, data, merge(defaultAxiosConfig, config))
    .then((response) => {
      return makeOkResponse(response);
    })
    .catch((err: AxiosError<ApiError<TData>>) => {
      return makeErrorResponse(err.response);
    });
};

export const put = async <TResponse, TData>(
  url: string,
  data: TData,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<TResponse, TData>> => {
  return await axios
    .put<TData, AxiosResponse<TResponse>>(url, data, merge(defaultAxiosConfig, config))
    .then((response) => {
      return makeOkResponse(response);
    })
    .catch((err: AxiosError<ApiError<TData>>) => {
      return makeErrorResponse(err.response);
    });
};

export const del = async <TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<TResponse, unknown>> => {
  return await axios
    .delete<TResponse>(url, merge(defaultAxiosConfig, config))
    .then((response) => {
      return makeOkResponse(response);
    })
    .catch((err: AxiosError<ApiError<unknown>>) => {
      return makeErrorResponse(err.response);
    });
};
