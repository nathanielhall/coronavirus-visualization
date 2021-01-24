import axios from 'axios'
import { RequestConfig, Response, RequestError } from './types'

// TOOD: this would normally be in env
// const baseURL = 'http://localhost:8080/'

// Set axios defaults here
const axiosClient = axios.create({ method: 'GET' })
let cancelToken = axios.CancelToken.source()

const actions = {
  cancel: () => cancelToken.cancel('cancel request'),
  isCancel: (error: RequestError) => axios.isCancel(error)
}

const request: <T = any>(
  config: RequestConfig
) => Promise<Response<T>> = async (config) => {
  const onSuccess = (response: Response) => {
    return response
  }

  const onError = (error: RequestError) => {
    if (axios.isCancel(error)) {
      // reset cancel token
      cancelToken = axios.CancelToken.source()
    }

    console.error(error, 'onError')
    return Promise.reject(error)
  }

  try {
    const response = await axiosClient({
      ...config,
      cancelToken: cancelToken.token
    })
    return onSuccess(response)
  } catch (error) {
    return onError(error)
  }
}

export const client = {
  actions,
  request,
  get: <T>(url: string) => request<T>({ url, method: 'GET' }),
  post: (url: string, data: any) => request({ url, data, method: 'POST' }),
  put: (url: string, data: any) => request({ url, data, method: 'PUT' }),
  delete: (url: string, data: any) => request({ url, data, method: 'DELETE' }),
  patch: (url: string, data: any) => request({ url, data, method: 'PATCH' })
}
