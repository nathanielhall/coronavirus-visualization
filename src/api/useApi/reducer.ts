import { Reducer } from 'react'
import { ActionUnion, Response, RequestError } from './types'

// Constants
export const FETCHING = '[api] Fetching'
export const SUCCESS = '[api] Success'
export const ERROR = '[api] Error'

// Action Creators
export const Actions = {
  fetching: () => ({ type: FETCHING } as const),
  success: (response: Response) =>
    ({ type: SUCCESS, payload: response } as const),
  error: (error: RequestError) => ({ type: ERROR, payload: error } as const)
}

export type Actions = ActionUnion<typeof Actions>

export type StatusType = 'idle' | 'pending' | 'resolved' | 'rejected'

// Reducer
export type ApiState<T> = {
  status: StatusType
  response?: Response<T>
  error?: RequestError
}

export const initialState: ApiState<any> = {
  status: 'idle',
  response: undefined,
  error: undefined
}

export const reducer: Reducer<ApiState<any>, Actions> = (
  state = initialState,
  actions
) => {
  switch (actions.type) {
    case FETCHING:
      return { ...initialState, status: 'pending' }
    case SUCCESS:
      return { ...state, status: 'resolved', response: actions.payload }
    case ERROR:
      return { ...state, status: 'rejected', error: actions.payload }
    default:
      return state
  }
}
