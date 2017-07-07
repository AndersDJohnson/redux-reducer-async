import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import jestAsync from './jest-async'
import createReducer from '..'

describe('redux-promise-middleware', () => {
  const type = 'MY_ACTION'
  const reducer = createReducer(type)
  let store

  beforeEach(() => {
    store = createStore(reducer, {}, applyMiddleware(promiseMiddleware()))
  })

  it('should work with resolve', done => {
    store.dispatch({ type, payload: Promise.resolve(1) })
    expect(store.getState()).toEqual({
      loading: true,
      error: null
    })
    jestAsync(() => {
      expect(store.getState()).toEqual({
        loading: false,
        data: 1,
        error: null
      })
    }, done)
  })

  it('should work with reject', done => {
    const error = new Error('oops')
    store.dispatch({ type, payload: Promise.reject(error) })
    expect(store.getState()).toEqual({
      loading: true,
      error: null
    })
    jestAsync(() => {
      expect(store.getState()).toEqual({
        loading: false,
        error
      })
    }, done)
  })
})
