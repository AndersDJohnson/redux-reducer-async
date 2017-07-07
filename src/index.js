const defaultKeys = {
  loading: 'loading',
  success: 'data',
  error: 'error'
}

function makeDefaultHandlers (keys) {
  return {
    loading: state => ({
      ...state,
      [keys.loading]: true,
      [keys.error]: null
    }),
    success: (state, action) => ({
      ...state,
      [keys.loading]: false,
      [keys.error]: null,
      [keys.success]: action.payload
    }),
    error: (state, action) => ({
      ...state,
      [keys.loading]: false,
      [keys.error]: action.payload
    })
  }
}

export function finalActionType (type) {
  return {
    loading: `${type}_PENDING`,
    success: type,
    error: type
  }
}

export function actionTypes (type, loading, success, error) {
  /* eslint-disable no-unneeded-ternary */
  loading = loading == null ? '_PENDING' : loading ? loading : ''
  success = success == null ? '_FULFILLED' : success ? success : ''
  error = error == null ? '_REJECTED' : error ? error : ''
  /* eslint-enable no-unneeded-ternary */
  return {
    loading: `${type}${loading}`,
    success: `${type}${success}`,
    error: `${type}${error}`
  }
}

export default function createReducer (types, handlers, initialState = {}) {
  const safeHandlers = handlers || {}
  const usedTypes = typeof types === 'string' ? actionTypes(types) : { ...types }

  const keys = {}

  keys.loading = typeof safeHandlers.loading === 'string' ? safeHandlers.loading : defaultKeys.loading
  keys.success = typeof safeHandlers.success === 'string' ? safeHandlers.success : defaultKeys.success
  keys.error = typeof safeHandlers.error === 'string' ? safeHandlers.error : defaultKeys.error

  const usedHandlers = { ...safeHandlers }

  const defaultHandlers = makeDefaultHandlers(keys)

  usedHandlers.loading = typeof usedHandlers.loading === 'function' ? usedHandlers.loading : defaultHandlers.loading
  usedHandlers.success = typeof usedHandlers.success === 'function' ? usedHandlers.success : defaultHandlers.success
  usedHandlers.error = typeof usedHandlers.error === 'function' ? usedHandlers.error : defaultHandlers.error

  return (state = initialState, action = {}) => {
    switch (action.type) {
      case `${usedTypes.loading}`:
        return usedHandlers.loading(state, action)
      case `${usedTypes.success}`:
      case `${usedTypes.error}`:
        if (action.error) {
          return usedHandlers.error(state, usedHandlers.transformError
            ? {
              ...action,
              payload: usedHandlers.transformError(action.payload)
            }
            : action
          )
        }
        return usedHandlers.success(state, usedHandlers.transform
          ? {
            ...action,
            payload: usedHandlers.transform(action.payload)
          }
          : action
        )
      default:
        return state
    }
  }
}
