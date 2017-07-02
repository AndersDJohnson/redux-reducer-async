# redux-reducer-async

Create redux reducers for async behaviors of multiple actions.

Manages properties on state for loading, success, and error cases.

By default, we support the conventions of [`redux-promise-middleware`] and [FSA].

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

To support [`redux-promise`], which uses same the action type for success and error cases,
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

You can provide custom keys (all optional) for each case to be used on the state:

```js
createReducer('MY_ACTION', {
  loading: 'isMyActionLoading',
  success: 'myActionData',
  error: 'myActionError'
})
```

Or custom reducer functions (again all optional):

```js
createReducer('MY_ACTION', {
  loading: state => ({
    ...state,
    myActionError: null,
    myActionIsLoading: true,
    extra: 'whatever'
  }),
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
    myError: action.payload,
    also: 'etc'
  })
})
```

[redux-promise-middleware]: https://github.com/pburtchaell/redux-promise-middleware
[redux-promise]: https://github.com/acdlite/redux-promise
[FSA]: https://github.com/acdlite/flux-standard-action
