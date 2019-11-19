import 'mocha'
import { expect } from 'chai'
import { createStore } from 'redux'
import { getParentState } from '../../src'

const STORE_NAME = 'FooStore'

describe('getParentState', () => {
    it('should return undefined if no parent window exists', () => {
        createFakeWindow(null)
        const result = getParentState([], STORE_NAME)
        expect(result).to.be.undefined
    })

    it('should return undefined if parent window has no store member', () => {
        createFakeWindow({})
        const result = getParentState([], STORE_NAME)
        expect(result).to.be.undefined
    })

    it('should return undefined if parent store has wrong type', () => {
        createFakeWindow({ [STORE_NAME]: true })
        const result = getParentState([], STORE_NAME)
        expect(result).to.be.undefined
    })

    it('should return undefined if parent store has no getState function', () => {
        createFakeWindow({ [STORE_NAME]: {} })
        const result = getParentState([], STORE_NAME)
        expect(result).to.be.undefined
    })

    it('should return undefined if parent store does not contain the requested key ', () => {
        const initialState = { foo: 123 }
        const store = createStore((s: any) => s, initialState)
        createFakeWindow({ [STORE_NAME]: store })
        const result = getParentState(['bar'], STORE_NAME)
        expect(result).to.be.undefined
    })

    it('should return the state slice matching the keys', () => {
        const initialState  = { foo: 123, bar: 456, baz: 789 }
        const expectedState = { foo: 123, baz: 789 }
        const store = createStore((s: any) => s, initialState)
        createFakeWindow({ [STORE_NAME]: store })
        const result = getParentState(['foo', 'baz'], STORE_NAME)
        expect(result).to.eql(expectedState)
    })
})

const createFakeWindow = (parent: Object | null): void => {
    (global as any).window = {}
    if (parent) {
        (global as any).window.parent = parent
    }
}
