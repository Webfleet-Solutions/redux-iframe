import { Store } from 'redux'

/**
 * Assigns the Redux store to the window object under the given name.
 *
 * @param store the Redux store object
 * @param globalName the global name of the Redux store
 */
export function makeStoreGlobal(store: Store, globalName: string = 'ReduxStore') {
    (window as any)[globalName] = store
}
