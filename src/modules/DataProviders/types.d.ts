import { StatusType, RequestError } from 'src/api'

export type DataProvider<TData> = [
  StatusType,
  TData[] | undefined,
  RequestError | undefined,
  ((...params: any[]) => Promise<void>) | undefined
]