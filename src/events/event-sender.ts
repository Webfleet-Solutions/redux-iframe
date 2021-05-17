import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { WindowSelector, createIframeContentWindowSelector, parentWindowSelector } from './window-selector'
import { EVENT_MARKER } from './event-marker'

/**
 * Creates a Redux middleware that posts Redux actions to the parent (container) window using the Browser's event system.
 *
 * @param actionsToSend array of types (strings) of actions to be sent to the parent window
 * @param targetOrigin the target origin (URL), defaults to the URL of the current window
 */
export const createParentEventSender = (actionsToSend: Array<string>, targetOrigin: string = window.location.href): Middleware => (
    createEventSenderMiddleware(parentWindowSelector, actionsToSend, targetOrigin)
)

/**
 * Creates a Redux middleware that posts Redux actions to a module (iframe) window using the Browser's event system.
 *
 * @param actionsToSend array of types (strings) of actions to be sent to the module window
 * @param iFrameId element id of the target iframe
 * @param targetOrigin the target origin (URL), defaults to the URL of the current window
 */
export const createModuleEventSender = (actionsToSend: Array<string>, iFrameId: string, targetOrigin: string = window.location.href): Middleware => (
    createEventSenderMiddleware(createIframeContentWindowSelector(iFrameId), actionsToSend, targetOrigin)
)

/**
 * Creates a Redux middleware that posts Redux actions to a window (parent, iframe content window) using the Browser's event system.
 *
 * @param windowSelector function that returns the target window for the message
 * @param actionsToSend array of types (strings) of actions to be sent to the target window
 * @param targetOrigin the target origin (URL), defaults to the URL of the current window
 * @param verbose boolean that logs sent message to console if true
 */
const createEventSenderMiddleware = (windowSelector: WindowSelector, actionsToSend: Array<string>, targetOrigin: string, verbose: boolean = false): Middleware => {
    return (store: MiddlewareAPI<Dispatch<AnyAction>>) => {
        return (next: Dispatch<AnyAction>) => {
            return (action: AnyAction) => {
                if (action[EVENT_MARKER]) {
                    // This marker is set by the event lister.
                    // Such actions are not sent again to avoid cycles.
                    delete action[EVENT_MARKER]
                }
                else if (actionsToSend.includes(action.type)) {
                    const targetWindow = windowSelector()
                    if (targetWindow) { // Target window (iframe) may not be loaded at the moment
                        const message = JSON.stringify(action)
                        if (verbose) console.log('Sending message', message)
                        targetWindow.postMessage(message, targetOrigin)
                    }
                }
                next(action)
            }
        }
    }
}
