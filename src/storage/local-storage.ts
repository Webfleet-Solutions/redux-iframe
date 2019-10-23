import { Store } from 'redux'
import { filterState, IndexedObject } from '../state/filter-state'

/**
 * Reads the Redux store content from local storage. Returns undefined if no state exists.
 *
 * @param keys array of Redux top-level keys to load
 * @param rootKey name of the top-level key of the global storage
 */
export const getStoredState = (keys: Array<string>, rootKey: string = 'state'): Object | undefined => {
    if (!window.localStorage) {
        console.warn('LocalStorage is not supported')
        return undefined
    }
    try {
        const serializedState = window.localStorage.getItem(rootKey)
        if (serializedState === null) {
            // If no state was stored previously, tell the store constructor that no initial state exists
            return undefined
        }
        const filteredState = filterState(JSON.parse(serializedState), keys)
        // TODO: Remove or configure log output
        console.log('Loaded state from local storage:', filteredState)
        return filteredState
    } catch (err) {
        console.warn('Cannot read from local storage:', err)
        return undefined
    }
}

/**
 * Subscribes to the given Redux store and copies all substates matching one of the keys to local storage.
 *
 * @param store a Redux store
 * @param keys array of Redux top-level keys to save
 * @param rootKey name of the top-level key of the global storage
 */
export const installStorageWriter = (store: Store, keys: Array<string>, rootKey: string = 'state') => {
    if (!window.localStorage) {
        console.warn('LocalStorage is not supported')
        return
    }
    let memoizedState: IndexedObject | undefined
    store.subscribe(() => {
        const state = filterState(store.getState(), keys)
        if (state && hasChanged(memoizedState, state)) {
            saveState(state, rootKey)
            memoizedState = state
        }
    })
}

/**
 * Saves the state of the Redux store to local storage.
 *
 * @param state the Redux state object
 * @param rootKey name of the top-level key of the global storage
 */
const saveState = (state: Object, rootKey: string = 'state') => {
    try {
        if (state) {
            // TODO: Remove or configure log output
            console.log('Saved state to local storage:', state)
            window.localStorage.setItem(rootKey, JSON.stringify(state))
        }
    } catch (err) {
        console.warn('Cannot write to local storage:', err)
    }
}

const hasChanged = (memoizedState: IndexedObject | undefined, state: IndexedObject): boolean => {
    for (const key in state) {
        if (!memoizedState || memoizedState[key] !== state[key]) {
            return true
        }
    }
    return false
}
