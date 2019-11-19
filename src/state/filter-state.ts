export type IndexedObject = {[key: string]: any} // https://stackoverflow.com/a/44441178

/**
 * Returns a shallow copy of the passed state object containing only the properties whose keys are given as second argument.
 * Returns undefined if keys are given, but none applies.
 *
 * @param state the Redux state object to filter
 * @param keys an array of property names to copy
 */
export const filterState = (state: IndexedObject | undefined, keys: Array<string>): Object | undefined => {
    let result: IndexedObject | undefined
    if (state) {
        for (const key of keys) {
            if (key in state) {
                if (!result) {
                    result = {}
                }
                result[key] = state[key]
            }
        }
    }
    return result
}
