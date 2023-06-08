import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useNotificationStore } from '../store/notification';
import { useAuthenticationStore } from '../store/authentication';

enum Status {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 403,
  NotFound = 404,
  InternalServerError = 500,
}

interface MethodResponse {
  status: Status,
  message: {
    code: string,
    value: string,
    params: Record<string, string | number | boolean>,
  },
  value?: unknown,
}

axios.defaults.responseType = 'json';

function handleNotification(response: AxiosResponse<MethodResponse>): void {
  const notification = useNotificationStore();

  const {
    code, params, value,
  } = response.data.message;

  if (code) {
    if (response.status === Status.Success) {
      notification.add({
        type: 'success',
        code,
        params,
        message: value,
      });
    } else if ([
      Status.BadRequest,
      Status.NotFound,
      Status.InternalServerError,
      Status.Unauthorized,
    ].includes(response.status)) {
      notification.add({
        type: 'error',
        code,
        params,
        message: value,
      });
    }
  }
}

axios.interceptors.response.use((response: AxiosResponse<MethodResponse>) => {
  if (response.data?.message) {
    handleNotification(response);
  }
  return response;
}, (error: AxiosError<MethodResponse>) => {
  if (error.response?.data?.message) {
    handleNotification(error.response);
  }

  throw error;
});

axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  if (request.withCredentials) {
    const authentication = useAuthenticationStore();

    if (authentication.currentToken) {
      request.headers.Authentication = authentication.currentToken;
    }
  }

  return request;
});
