// Cross-window event sender middleware and event listener
export { createModuleEventSender, createParentEventSender } from './events/event-sender'
export { installEventListener } from './events/event-listener'

// Local storage needed by iframe modules
export { getStoredState, installStorageWriter } from './storage/local-storage'

// Access to the parent Redux state needed by iframe modules
export { makeStoreGlobal } from './global/global-store'
export { getParentState } from './global/parent-state'
export { combineState } from './state/combine-state'
