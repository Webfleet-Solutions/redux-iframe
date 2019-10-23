import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { createModuleEventSender, installEventListener, makeStoreGlobal } from 'redux-iframe'
import { menuColorReducer, moduleColorReducer, MENU_COLOR_STATE, MODULE_COLOR_STATE, SET_MENU_COLOR, SET_MODULE_COLOR } from 'lib-common'
import { MenuConnected } from './menu-connected'
import { IFRAME_ID } from './constants'
import './index.css'

// All reducers needed by the application (for either action creation or consumption)
const reducers = {
    [MENU_COLOR_STATE]: menuColorReducer,
    [MODULE_COLOR_STATE]: moduleColorReducer
}

// Send Redux actions as messages to modules (loaded into iframe content windows)
const eventSenderMiddleware = createModuleEventSender([SET_MODULE_COLOR], IFRAME_ID)

const store = createStore(combineReducers(reducers), applyMiddleware(createLogger(), eventSenderMiddleware))

ReactDOM.render(
    <Provider store={store}>
        <MenuConnected/>
    </Provider>,
    document.getElementById('root')
)

// Listen to "message" events and create + dispatch corresponding Redux actions
installEventListener(store, [SET_MENU_COLOR])

// Make the Redux store accessible (read only) by modules via window.parent
makeStoreGlobal(store)
