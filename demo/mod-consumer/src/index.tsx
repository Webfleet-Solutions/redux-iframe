import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { getParentState, installEventListener } from 'redux-iframe'
import { moduleColorReducer, MODULE_COLOR_STATE, SET_MODULE_COLOR } from 'lib-common'
import { ConsumerConnected } from './consumer-connected'
import './index.css'

// All reducers needed by this module (for either action creation or consumption)
const reducers = { [MODULE_COLOR_STATE]: moduleColorReducer }

// Copy selected subtrees of the Redux state of the parent (container) window
const initialState = getParentState([MODULE_COLOR_STATE])

const store = createStore(combineReducers(reducers), initialState, applyMiddleware(createLogger()))

ReactDOM.render(
    <Provider store={store}>
        <ConsumerConnected/>
    </Provider>,
    document.getElementById('root')
)

// Listen to "message" events matching the passed action names and create + dispatch corresponding Redux actions
installEventListener(store, [SET_MODULE_COLOR])
