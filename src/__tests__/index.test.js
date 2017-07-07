/* eslint-env jest */

import createReducer, { actionTypes, finalActionType } from '..'

describe('createReducer', () => {
  const type = 'MY_ACTION'
  const data = 'data'
  const payload = data
  const error = new Error('oops')

  describe('type', () => {
    const types = actionTypes(type)
    const reducer = createReducer(type)

    it('should set loading', () => {
      expect(reducer({
        loading: false,
        data,
        error
      }, { type: types.loading })).toEqual({
        loading: true,
        data,
        error: null
      })
    })

    it('should set success', () => {
      expect(reducer({
        loading: true,
        error
      }, { type: types.success, payload })).toEqual({
        loading: false,
        data,
        error: null
      })
    })

    it('should set error', () => {
      expect(reducer({
        loading: true,
        data
      }, { type: types.error, error: true, payload: error })).toEqual({
        loading: false,
        data,
        error
      })
    })
  })

  describe('custom types', () => {
    const types = actionTypes(type, 'MY_LOADING', 'MY_SUCCESS', 'MY_ERROR')
    const reducer = createReducer(types)

    it('should set loading', () => {
      expect(reducer({
        loading: false,
        data,
        error
      }, { type: types.loading })).toEqual({
        loading: true,
        data,
        error: null
      })
    })

    it('should set success', () => {
      expect(reducer({
        loading: true,
        data,
        error
      }, { type: types.success, payload })).toEqual({
        loading: false,
        data,
        error: null
      })
    })

    it('should set error', () => {
      expect(reducer({
        loading: true,
        data
      }, { type: types.error, error: true, payload: error })).toEqual({
        loading: false,
        data,
        error
      })
    })
  })

  describe('final type', () => {
    const types = finalActionType('MY_GIRL')
    const reducer = createReducer(types)

    it('should set loading', () => {
      expect(reducer({
        loading: false,
        data,
        error
      }, { type: types.loading })).toEqual({
        loading: true,
        data,
        error: null
      })
    })

    it('should set success', () => {
      expect(reducer({
        loading: true,
        data,
        error
      }, { type: types.success, payload })).toEqual({
        loading: false,
        data,
        error: null
      })
    })

    it('should set error', () => {
      expect(reducer({
        loading: true,
        data
      }, { type: types.error, error: true, payload: error })).toEqual({
        loading: false,
        data,
        error
      })
    })
  })

  describe('initial state', () => {
    it('should set', () => {
      const reducer = createReducer(type, null, { init: true })
      expect(reducer()).toEqual({
        init: true
      })
    })
  })

  describe('custom keys', () => {
    const types = actionTypes(type)
    const reducer = createReducer(type, {
      loading: 'myLoading',
      success: 'myData',
      error: 'myError'
    })

    it('should set loading', () => {
      expect(reducer({}, { type: types.loading })).toEqual({
        myLoading: true,
        myError: null
      })
    })

    it('should set success', () => {
      expect(reducer({}, { type: types.success, payload })).toEqual({
        myLoading: false,
        myData: data,
        myError: null
      })
    })

    it('should set error', () => {
      expect(reducer({}, { type: types.error, error: true, payload: error })).toEqual({
        myLoading: false,
        myError: error
      })
    })
  })

  describe('custom functions', () => {
    const types = actionTypes(type)
    const reducer = createReducer(type, {
      loading: () => ({ myLoading: true }),
      success: () => ({ mySuccess: true }),
      error: () => ({ myError: true })
    })

    it('should set loading', () => {
      expect(reducer({}, { type: types.loading })).toEqual({
        myLoading: true
      })
    })

    it('should set success', () => {
      expect(reducer({}, { type: types.success, payload })).toEqual({
        mySuccess: true
      })
    })

    it('should set error', () => {
      expect(reducer({}, { type: types.error, error: true, payload: error })).toEqual({
        myError: true
      })
    })
  })

  describe('custom mix', () => {
    const types = actionTypes(type)
    const reducer = createReducer(type, {
      loading: 'myLoading',
      success: state => ({ ...state, mySuccess: true, myError: false })
    })

    it('should set loading', () => {
      expect(reducer({}, { type: types.loading })).toEqual({
        myLoading: true,
        error: null
      })
    })

    it('should set success', () => {
      expect(reducer(
        { foo: 'bar' },
        { type: types.success, payload })
      ).toEqual({
        mySuccess: true,
        myError: false,
        foo: 'bar'
      })
    })

    it('should set error', () => {
      expect(reducer({}, { type: types.error, error: true, payload: error })).toEqual({
        error,
        myLoading: false
      })
    })
  })

  describe('transforms', () => {
    const types = actionTypes(type)
    const reducer = createReducer(type, {
      transform: data => data + 1,
      transformError: data => data - 1
    })

    it('transforms success', () => {
      expect(reducer({}, {
        type: types.success,
        payload: 1
      })).toEqual({
        loading: false,
        data: 2,
        error: null
      })
    })

    it('transforms error', () => {
      expect(reducer({}, {
        type: types.error,
        error: true,
        payload: 1
      })).toEqual({
        loading: false,
        error: 0
      })
    })
  })
})

describe('actionTypes', () => {
  it('should default suffixes when all are not passed', () => {
    expect(actionTypes('MY_ACTION')).toEqual({
      loading: 'MY_ACTION_PENDING',
      success: 'MY_ACTION_FULFILLED',
      error: 'MY_ACTION_REJECTED'
    })
  })
  it('should default suffixes when some are not passed', () => {
    expect(actionTypes('MY_ACTION', '_LOADING')).toEqual({
      loading: 'MY_ACTION_LOADING',
      success: 'MY_ACTION_FULFILLED',
      error: 'MY_ACTION_REJECTED'
    })
  })
  it('should default suffixes when some are falsy', () => {
    expect(actionTypes('MY_ACTION', 0)).toEqual({
      loading: 'MY_ACTION',
      success: 'MY_ACTION_FULFILLED',
      error: 'MY_ACTION_REJECTED'
    })
  })
  it('should default suffixes on null or undefined', () => {
    expect(actionTypes('MY_ACTION', '_LOADING', undefined, null)).toEqual({
      loading: 'MY_ACTION_LOADING',
      success: 'MY_ACTION_FULFILLED',
      error: 'MY_ACTION_REJECTED'
    })
  })
  it('should suppress suffix on empty string', () => {
    expect(actionTypes('MY_ACTION', undefined, '', '')).toEqual({
      loading: 'MY_ACTION_PENDING',
      success: 'MY_ACTION',
      error: 'MY_ACTION'
    })
  })
  it('should suppress suffix on falsy', () => {
    expect(actionTypes('MY_ACTION', undefined, false, 0)).toEqual({
      loading: 'MY_ACTION_PENDING',
      success: 'MY_ACTION',
      error: 'MY_ACTION'
    })
  })
})
