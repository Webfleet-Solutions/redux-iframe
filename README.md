# Redux-iframe

Build stateful micro frontends by sharing Redux state and actions between `<iframe>` modules and container applications:
* Pass Redux actions across window boundaries using the Browser's event system.
* Inherit parts of the Redux state from a parent application when a module is loaded.
* Save Redux state in the Browser's local storage and retrieve it on reloading of modules.

Redux-iframe is a tiny 2.5k library with [Redux](https://github.com/reduxjs/redux) as only dependency.

[![build status](https://img.shields.io/travis/Webfleet-Solutions/redux-iframe/master.svg?style=flat-square)](https://travis-ci.org/Webfleet-Solutions/redux-iframe)
[![npm version](https://img.shields.io/npm/v/redux-iframe.svg?style=flat-square)](https://www.npmjs.com/package/redux-iframe)
[![coverage status](https://coveralls.io/repos/github/Webfleet-Solutions/redux-iframe/badge.svg?branch=master)](https://coveralls.io/github/Webfleet-Solutions/redux-iframe?branch=master)
[![license](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://opensource.org/licenses/MIT)

# Install
```
npm install redux-iframe
```
or
```
yarn add redux-iframe
```

# Usage

Note: The [demo](demo) folder contains an application demonstrating several use cases of `redux-iframe`.

## Preparations
Define all [ducks](https://github.com/erikras/ducks-modular-redux) needed by the application
and its modules in a shared library (say `shared`).

```javascript
// shared/index.js

export const MY_STATE = 'MY_STATE'
export const SET_MY_STATE = 'SET_MY_STATE'

export const setMyState = (payload) => ({
    type: SET_MY_STATE,
    payload
})

export default (state = {}, action) => (
    action.type === SET_MY_STATE ? action.payload : state
)
```

## Passing Actions
Actions are passed between modules, their parent application, and vice versa by leveraging the Browser's event system
(`postMessage` and `addEventListener`). All actions to be passed need to be defined in a shared library to guarantee
correct marshalling/unmarshalling with `JSON.stringify` and `JSON.parse`.

### From Module to Parent
```javascript
// module/index.js

import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createParentEventSender } from 'redux-iframe'
import { default as sharedReducer, MY_STATE, SET_MY_STATE } from 'shared'

const reducers = { [MY_STATE]: sharedReducer }
const eventSender = createParentEventSender([SET_MY_STATE])

const store = createStore(combineReducers(reducers), applyMiddleware(eventSender))

store.dispatch({ type: SET_MY_STATE, payload: 'Hello, world!' })
```

```javascript
// parent/index.js

import { combineReducers, createStore } from 'redux'
import { installEventListener } from 'redux-iframe'
import { default as sharedReducer, MY_STATE, SET_MY_STATE } from 'shared'

const reducers = { [MY_STATE]: sharedReducer }

const store = createStore(combineReducers(reducers))

installEventListener(store, [SET_MY_STATE])
```
### From Parent to Module
Analogous to module-to-parent direction, except that instead of `createParentEventSender` function `createModuleEventSender` should be used. 
```javascript
// parent/index.js

import { createModuleEventSender } from 'redux-iframe'
import { SET_MY_STATE } from 'shared'

const eventSender = createModuleEventSender([SET_MY_STATE], 'iframe-id')

// ...
```
The second parameter 'iframe-id' refers to the `id` attribute of the loaded iframe: `<iframe id='iframe-id'>`.
All modules should use the same iframe id. They should filter the actions they are interested in by passing the
corresponding action names as second parameter of function `installEventListener`. 

## Inheriting State
Modules can copy parts of the parent application's state on loading. Currently this works only under the following assumptions:
* Parent application and module iframe have the [same origin](https://javascript.info/cross-window-communication#same-origin).
* The parent's state is immutable (which is a general requirement for
[Redux to work properly](https://redux.js.org/recipes/structuring-reducers/prerequisite-concepts#note-on-immutability-side-effects-and-mutation)).
* The state slice to copy is just below the root of the state tree, identified by keys (`[MY_STATE]` in our example).

```javascript
// parent/index.js

import { combineReducers, createStore } from 'redux'
import { makeStoreGlobal } from 'redux-iframe'
import { default as sharedReducer, MY_STATE } from 'shared'

const store = createStore(combineReducers({ [MY_STATE]: sharedReducer }))

makeStoreGlobal(store)
```

```javascript
// module/index.js

import { combineReducers, createStore } from 'redux'
import { getParentState } from 'redux-iframe'
import { default as sharedReducer, MY_STATE } from 'shared'

const reducers = { [MY_STATE]: sharedReducer }

const initialState = getParentState([MY_STATE])

const store = createStore(combineReducers(reducers), initialState)
```

## Local Storage
Modules may save parts of their state in the Browser's local storage and retrieve it on re-loading. The storage cycle is triggered on each action,
but the actual writing to local storage only happens if one of the state parts changed. As for state inheritance, this currently works for top-level
keys only. 

```javascript
// module/index.js

import { combineReducers, createStore } from 'redux'
import { getStoredState, installStorageWriter } from 'redux-iframe'
import { default as sharedReducer, MY_STATE } from 'shared'

const reducers = { [MY_STATE]: sharedReducer }

const initialState = getStoredState([MY_STATE])

const store = createStore(combineReducers(reducers), initialState)

installStorageWriter(store, [MY_STATE])
```

## Merging Initial State
The results of functions `getParentState` and `getStoredState` can be merged. Function `combineState` can merge states with different
or the same top-level keys. If the keys are equal, arguments to the right overwrite left arguments, just as `Object.assign()` does.

```javascript
// module/index.js

import { combineReducers, createStore } from 'redux'
import { combineState, getParentState, getStoredState, installStorageWriter } from 'redux-iframe'
import { default as sharedReducer, MY_STATE } from '../shared'

const reducers = { [MY_STATE]: sharedReducer }

const initialState = combineState(
    getStoredState([MY_STATE]),
    getParentState([MY_STATE]))

const store = createStore(combineReducers(reducers), initialState)

installStorageWriter(store, [MY_STATE])
```

In the example, the parent state overwrites the local state, if any.

# To Do
* Allow inheriting the parent state via `postMessage`/`addEventListener`
* Allow copies of state slices below the root level 
* Let the user choose between Local Storage and Session Storage

# License

MIT
