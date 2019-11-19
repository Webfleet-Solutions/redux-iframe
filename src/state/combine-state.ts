/**
 * Merges a list of Redux state objects (which may be undefined). Returns undefined if all arguments are undefined.
 * Therefore, the result of this function can always be passed as second argument to Redux.createStore().
 *
 * Main differences to Object.assign() are that combineState()
 * (1) does not modify its first argument,
 * (2) accepts undefined for all arguments.
 *
 * @param state the Redux state objects to combine
 * @return the combined Redux state objects or undefined if all arguments are undefined
 */
export const combineState = (...state: (Object | undefined)[]): Object | undefined => {
    return state.reduce((prev: Object | undefined, curr: Object | undefined) => {
        if (prev || curr) {
            return Object.assign({}, prev, curr)
        }
        return undefined
    }, undefined)
}
