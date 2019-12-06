import 'mocha'
import { expect } from 'chai'
import { AnyAction, createStore } from 'redux'
import { installEventListener } from '../../src'
import { EVENT_MARKER } from '../../src/events/event-marker'

const actionType = 'FOO_ACTION'
const action: AnyAction = {
    type: actionType,
    payload: 123
}

describe('eventListener', () => {
    it('should receive events and dispatch them to the Redux store', () => {
        createFakeWindow()

        const store = createStore(createReducer(actionType))
        installEventListener(store, [action.type], { addMarker: false })

        expect(store.getState()).to.eql(action)
    })

    it('should add a marker before dispatching', () => {
        createFakeWindow()

        const store = createStore(createReducer(actionType))
        installEventListener(store, [action.type])

        // The listener adds a marker to the action, which is later removed by the event-sender middleware
        const expected = Object.assign({}, action, {
            [EVENT_MARKER]: true
        })

        expect(store.getState()).to.eql(expected)
    })

    it('should not dispatch unregistered actions to the Redux store', () => {
        createFakeWindow()

        const store = createStore(createReducer(actionType))
        installEventListener(store, [], { addMarker: false }) // No actions accepted

        expect(store.getState()).to.be.undefined
    })
})

const createReducer = (actionType: string) => (
    (state: any, action: AnyAction) => action.type === actionType ? action : state
)

const createFakeWindow = (): void => {
    (global as any).window = {
        addEventListener: (type: string, listener: (event: any) => void) => {
            expect(type).to.equal('message')
            // When the event listener is installed, send an event to the listener,
            // which should dispatch it to the Redux store.
            listener({ data: JSON.stringify(action) })
        }
    }
}
