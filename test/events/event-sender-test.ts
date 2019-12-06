import 'mocha'
import { expect } from 'chai'
import { AnyAction, applyMiddleware, createStore } from 'redux'
import { createModuleEventSender, createParentEventSender } from '../../src'
import { EVENT_MARKER } from '../../src/events/event-marker'

describe('eventSender', () => {
    it('should send events to the parent window', () => {
        const target = 'my-target'
        const action: AnyAction = { type: 'FOO_ACTION' }

        let messageCount = 0
        ;(global as any).window = {
            parent: {
                postMessage(message: any, targetOrigin: string): void {
                    expect(JSON.parse(message)).to.eql(action)
                    expect(targetOrigin).to.eql(target)
                    ++messageCount
                }
            }
        }

        const sender = createParentEventSender([action.type], target)
        const store = createStore(state => state, applyMiddleware(sender))
        store.dispatch(action)
        expect(messageCount).to.equal(1)
    })

    it('should send events to the module window', () => {
        const target = 'my-target'
        const iframe = 'my-frame'
        const action: AnyAction = { type: 'FOO_ACTION' }

        let messageCount = 0
        ;(global as any).document = {
            getElementById(elementId: string) {
                expect(elementId).to.eql(iframe)
                return {
                    contentWindow: {
                        postMessage(message: any, targetOrigin: string): void {
                            expect(JSON.parse(message)).to.eql(action)
                            expect(targetOrigin).to.eql(target)
                            ++messageCount
                        }
                    }
                }
            }
        }

        const sender = createModuleEventSender([action.type], iframe, target)
        const store = createStore(state => state, applyMiddleware(sender))
        store.dispatch(action)
        expect(messageCount).to.equal(1)
    })

    it('should not send events for unregistered actions', () => {
        const action: AnyAction = { type: 'FOO_ACTION' }

        let messageCount = 0
        ;(global as any).window = {
            parent: {
                postMessage(): void {
                    ++messageCount
                }
            }
        }

        const sender = createParentEventSender([], 'dummy') // No actions to send
        const store = createStore(state => state, applyMiddleware(sender))
        store.dispatch(action)
        expect(messageCount).to.equal(0)
    })

    it('should not send events if iframe does not exist', () => {
        const target = 'my-target'
        const iframe = 'my-frame'
        const action: AnyAction = { type: 'FOO_ACTION' }

        let messageCount = 0
        ;(global as any).document = {
            getElementById(elementId: string) {
                expect(elementId).to.eql(iframe)
                return null
            }
        }

        const sender = createModuleEventSender([action.type], iframe, target)
        const store = createStore(state => state, applyMiddleware(sender))
        store.dispatch(action)
        expect(messageCount).to.equal(0)
    })

    it('should not send events for actions previously received as events', () => {
        const action: AnyAction = {
            type: 'FOO_ACTION',
            [EVENT_MARKER]: true // Marker set by event listener created by installEventListener()
        }

        let messageCount = 0
        ;(global as any).window = {
            parent: {
                postMessage(): void {
                    ++messageCount
                }
            }
        }

        const sender = createParentEventSender([action.type], 'dummy')
        const store = createStore(state => state, applyMiddleware(sender))
        store.dispatch(action)
        expect(messageCount).to.equal(0)
    })
})
