import { createAction } from 'redux-actions'
import createReducer, { actionTypes } from '..'

describe('actions', () => {
  const type = 'MY_ACTION'
  const types = actionTypes(type)
  const reducer = createReducer(type)

  it('uses action creator with success', () => {
    const actionCreator = createAction(types.success)
    expect(reducer({}, actionCreator(1))).toEqual({
      loading: false,
      data: 1,
      error: null
    })
  })

  it('uses action creator with error', () => {
    const error = new Error('oops')
    const actionCreator = createAction(types.error)
    expect(reducer(
      {},
      actionCreator(error)
    )).toEqual({
      loading: false,
      error
    })
  })
})
