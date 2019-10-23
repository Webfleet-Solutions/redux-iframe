import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { getStoredState, installStorageWriter } from 'redux-iframe'
import { ownColorReducer, OWN_COLOR_STATE } from './own-color-duck'
import { SolitaryConnected } from './solitary-connected'
import './index.css'

// All reducers needed by this module (for either action creation or consumption)
const reducers = { [OWN_COLOR_STATE]: ownColorReducer }

// Copy selected subtrees of the Redux state from local storage
const initialState = getStoredState([OWN_COLOR_STATE])

const store = createStore(combineReducers(reducers), initialState, applyMiddleware(createLogger()))

ReactDOM.render(
    <Provider store={store}>
        <SolitaryConnected/>
    </Provider>,
    document.getElementById('root')
)

// Copy selected subtrees to the Redux state to local storage
installStorageWriter(store, [OWN_COLOR_STATE])
