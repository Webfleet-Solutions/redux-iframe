import { Store } from 'redux'
import { filterState, IndexedObject } from '../state/filter-state'

const ROOT_KEY = 'redux-iframe-state'

/**
 * Storage type
 */
export enum StorageType {
    /**
     * Use session storage (cleared if window closes)
     */
    SESSION,
    /**
     * Use use local storage (persistent)
     */
    LOCAL
}

/**
 * Storage options
 */
type StorageOptions = {
    /**
     * Name of the top-level key of the global storage
     */
    rootKey?: string
    /**
     * Storage type to use, either LOCAL (persistent) or SESSION (cleared if window closes)
     */
    storageType?: StorageType
}

const DEFAULT_STORAGE_OPTIONS : StorageOptions = {
    rootKey: ROOT_KEY,
    storageType: StorageType.SESSION
}

/**
 * Reads the Redux store content from local or session storage. Returns undefined if no state exists.
 *
 * @param keys array of Redux top-level keys to load
 * @param options storage options (which default to rootKey: 'state' and storage: SESSION)
 * @param verbose boolean that logs loaded state to console if true
 */
export const getStoredState = (keys: Array<string>, options: StorageOptions = DEFAULT_STORAGE_OPTIONS, verbose: boolean = false): Object | undefined => {
    const storage = getStorage(options.storageType || StorageType.SESSION)
    if (storage) {
        try {
            const serializedState = storage.getItem(options.rootKey || ROOT_KEY)
            if (serializedState === null) {
                // If no state was stored previously, tell the store constructor that no initial state exists
                return undefined
            }
            const filteredState = filterState(JSON.parse(serializedState), keys)
            if (verbose) console.log('Loaded state from storage:', filteredState)
            return filteredState
        } catch (err) {
            console.warn('Cannot read from storage:', err)
        }
    }
}

/**
 * Subscribes to the given Redux store and copies all substates matching one of the keys to local or session storage.
 *
 * @param store a Redux store
 * @param keys array of Redux top-level keys to save
 * @param options storage options (which default to rootKey: 'state' and storage: SESSION)
 */
export const installStorageWriter = (store: Store, keys: Array<string>, options: StorageOptions = DEFAULT_STORAGE_OPTIONS) => {
    let memoizedState: IndexedObject | undefined
    store.subscribe(() => {
        const state = filterState(store.getState(), keys)
        if (state && hasChanged(memoizedState, state)) {
            if (saveState(state, options)) {
                memoizedState = state
            }
        }
    })
}

const getStorage = (storageType: StorageType) => {
    switch (storageType) {
        case StorageType.LOCAL:
            if (!window.localStorage) {
                console.warn('Local storage is not supported')
                return undefined
            }
            return window.localStorage
        case StorageType.SESSION:
            if (!window.sessionStorage) {
                console.warn('Session storage is not supported')
                return undefined
            }
            return window.sessionStorage
    }
}

/**
 * Saves the state of the Redux store to local or session storage.
 *
 * @param state the Redux state object
 * @param options storage options (which default to rootKey: 'state' and storage: SESSION)
 * @param verbose boolean that logs saved state to console if true
 * @return true if storing succeeded, false otherwise
 */
const saveState = (state: Object, options: StorageOptions, verbose: boolean = false): boolean => {
    const storage = getStorage(options.storageType || StorageType.SESSION)
    if (storage) {
        try {
            if (state) {
                if (verbose) console.log('Saved state to storage:', state)
                storage.setItem(options.rootKey || ROOT_KEY, JSON.stringify(state))
                return true
            }
        } catch (err) {
            console.warn('Cannot write to storage:', err)
        }

    }
    return false
}

const hasChanged = (memoizedState: IndexedObject | undefined, state: IndexedObject): boolean => {
    for (const key in state) {
        if (!memoizedState || memoizedState[key] !== state[key]) {
            return true
        }
    }
    return false
}
