import { filterState } from '../state/filter-state'
import { Store } from 'redux'

/**
 * Returns a shallow copy of the Redux state of the parent window for selected keys.
 * Returns undefined if no parent window exists.
 *
 * To use this functions, two requirements must be met:
 * - The module iframe and its parent window belong to the same domain. Otherwise the Browser will not provide a reference
 *   to the parent window.
 * - The parent's Redux state is immutable. Redux is designed for immutability and explicitly discourages state mutation, see
 *   https://redux.js.org/recipes/structuring-reducers/prerequisite-concepts#note-on-immutability-side-effects-and-mutation.
 *
 * TODO: Allow transferring the parent state via postMessage/addEventListener
 *
 * @param keys array of Redux top-level keys to copy from
 * @param globalName name of the global variable holding the Redux store
 * @param verbose boolean that logs loaded state to console if true
 * @return a slice of the store of the parent window or undefined if no parent window exists
 */
export const getParentState = (keys: Array<string>, globalName: string = 'ReduxStore', verbose: boolean = false): Object | undefined => {
    if (window.parent && typeof (window.parent as any)[globalName] === 'object') {
        const parentStore: Store = (window.parent as any)[globalName]
        if (typeof parentStore.getState === 'function') {
            const parentState = parentStore.getState()
            const filteredState = filterState(parentState, keys)
            if (verbose) console.log('Loaded state from parent window:', filteredState)
            return filteredState
        }
    }
    return undefined
}

