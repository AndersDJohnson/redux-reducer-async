# redux-reducer-async
> Create redux reducers for async behaviors of multiple actions.

[![npm](https://img.shields.io/npm/v/redux-reducer-async.svg)](https://npmjs.com/package/redux-reducer-async) 
[![Travis CI](https://img.shields.io/travis/AndersDJohnson/redux-reducer-async.svg)](https://travis-ci.org/AndersDJohnson/redux-reducer-async)
[![Codecov](https://img.shields.io/codecov/c/github/AndersDJohnson/redux-reducer-async.svg)](https://codecov.io/gh/AndersDJohnson/redux-reducer-async)

Be DRY & reduce boilerplate.
Standardize state schema with managed properties for loading, success, and error cases.

By default, we support the conventions of [`redux-promise-middleware`][redux-promise-middleware] and [FSA].

So this:

```js
import createReducer from 'redux-reducer-async'

createReducer('MY_ACTION')
```

results in a reducer like this:

```js
(state = {}, action = {}) => {
  switch (action.type) {
    case 'MY_ACTION_PENDING':
      return { ...state, loading: true }
    case 'MY_ACTION_FULFILLED':
      return { ...state, loading: false, error: null, data: action.payload }
    case 'MY_ACTION_PENDING':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
```

You can provide custom property names (all optional) for each case to be used on the state:

```js
createReducer('MY_ACTION', {
  loading: 'isMyActionLoading',
  success: 'myActionData',
  error: 'myActionError'
})
```

Or custom reducer functions (again all optional, but be careful to define all cases if you use non-standard property names in one):

```js
createReducer('MY_ACTION', {
  loading: state => ({
    ...state,
    myActionError: null,
    myActionIsLoading: true,
    extra: 'whatever'
  })
  // success, error...
})
```

And you can even mix these:

```js
createReducer('MY_ACTION', {
  loading: 'isLoading',
  error: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
    also: 'etc'
  })
})
```

To support [`redux-promise`][redux-promise], which uses same the action type for success and error cases,
you can use `finalActionType`:

```js
import createReducer, { finalActionType } from 'redux-reducer-async'

createReducer(finalActionType('MY_ACTION'))
```

which is effectively like providing custom action types:

```js
createReducer({
  loading: 'MY_ACTION_PENDING',
  success: 'MY_ACTION',
  error: 'MY_ACTION'
})
```

Or similarly by passing suffixes to the `actionTypes` helper, 
which is normally used to explicitly default all types:

```js
import createReducer, { actionTypes } from 'redux-reducer-async'

createReducer(actionTypes('MY_ACTION', '_LOADING', '_SUCCESS', '_ERROR'))
```

But can also be used to suppress suffixes (here undefined means use default):

```js
createReducer(actionTypes('MY_ACTION', undefined, '', ''))
```


[redux-promise-middleware]: https://github.com/pburtchaell/redux-promise-middleware
[redux-promise]: https://github.com/acdlite/redux-promise
[FSA]: https://github.com/acdlite/flux-standard-action
