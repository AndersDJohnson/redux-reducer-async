import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise'
import createReducer, { finalActionType } from '..'

describe('redux-promise', () => {
  const type = 'MY_ACTION'
  const reducer = createReducer(finalActionType(type))
  let store

  beforeEach(() => {
    store = createStore(reducer, {}, applyMiddleware(promiseMiddleware))
  })

  it('should work with resolve', async () => {
    await store.dispatch({ type, payload: Promise.resolve(1) })
    expect(store.getState()).toEqual({
      loading: false,
      data: 1,
      error: null
    })
  })

  it('should work with reject', async () => {
    const error = new Error('oops')
    await store.dispatch({ type, payload: Promise.reject(error) })
    expect(store.getState()).toEqual({
      loading: false,
      error
    })
  })
})
