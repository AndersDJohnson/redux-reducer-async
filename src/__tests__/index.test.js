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
})
