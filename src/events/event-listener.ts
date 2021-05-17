import { AnyAction, Store } from 'redux'
import { EVENT_MARKER } from './event-marker'

/**
 * Parameters to control the event listener
 */
type EventListenerOptions = {
    /**
     * If true, the event listener adds a marker to the action, which is later recognized (and removed) by the
     * event-sender middleware (see {@link createEventSenderMiddleware}). The marker avoids resending of actions
     * received as events, which would lead to cycles. Pass <code>false</code> only if this module or container
     * application does not sent events for actions accepted by {@link installEventListener}. In other words:
     * pass <code>false</code> if {@link createEventSenderMiddleware} is not called by your module/application
     * or if the arrays <code>actionsToSend</code> and <code>acceptedActions</code> are disjoint.
     */
    addMarker: boolean
    /**
     * If true, log all received messages from iFrame and their event.data.
     */
    verbose: boolean
}

/**
 * Installs an event handler that creates Redux actions from received events and dispatches them.
 *
 * @param store the Redux store
 * @param acceptedActions array of types (strings) of accepted actions
 * @param options parameters to control the event listener
 */
export const installEventListener = (store: Store, acceptedActions: Array<string>, options: EventListenerOptions = { addMarker: true, verbose: false }) => {
    window.addEventListener('message', event => {
        if (options.verbose) console.log('Received message', event.data)
        try {
            const action: AnyAction = JSON.parse(event.data)
            if (action.type && acceptedActions.includes(action.type)) {
                if (options.addMarker) {
                    // Set a marker recognized (and removed) by the event-sender middleware.
                    // The marker avoids resending of actions received as events.
                    action[EVENT_MARKER] = true
                }
                store.dispatch(action)
            }
        }
        catch {
            // Ignore non-JSON messages
        }
    })
}
