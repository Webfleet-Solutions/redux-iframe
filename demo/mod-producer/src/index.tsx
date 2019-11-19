import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { createParentEventSender, getParentState } from 'redux-iframe'
import { menuColorReducer, MENU_COLOR_STATE, SET_MENU_COLOR } from 'lib-common'
import { ProducerConnected } from './producer-connected'
import './index.css'

// All reducers needed by this module (for either action creation or consumption)
const reducers = { [MENU_COLOR_STATE]: menuColorReducer }

// Copy selected subtrees of the Redux state of the parent (container) window
const initialState = getParentState([MENU_COLOR_STATE])

// Send selected Redux actions as messages to the parent (container) application
const eventSenderMiddleware = createParentEventSender([SET_MENU_COLOR])

const store = createStore(combineReducers(reducers), initialState, applyMiddleware(createLogger(), eventSenderMiddleware))

ReactDOM.render(
    <Provider store={store}>
        <ProducerConnected/>
    </Provider>,
    document.getElementById('root')
)
