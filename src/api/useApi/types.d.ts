interface ActionCreator<A> {
  (...args: any[]): A
}
interface ActionCreatorsMapObject<A = any> {
  [key: string]: ActionCreator<A>
}
export type ActionUnion<T extends ActionCreatorsMapObject> = ReturnType<
  T[keyof T]
>

export type Method =
  | 'GET'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'PATCH'

interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  throwIfRequested(): void
}
interface Cancel {
  message: string
}

export type RequestConfig<TData = any> = {
  url?: string
  method?: Method
  baseURL?: string
  headers?: any
  params?: any
  data?: TData
  cancelToken?: CancelToken
}

export type Response<TData = any> = {
  data: TData
  status: number
  statusText: string
  request?: any
}

export type RequestError = Error & {
  config: RequestConfig
  code?: string
  request?: any
  response?: Response
  stack?: string
}
