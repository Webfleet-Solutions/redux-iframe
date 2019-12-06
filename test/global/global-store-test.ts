import 'mocha'
import { expect } from 'chai'
import { AnyAction, createStore } from 'redux'
import { makeStoreGlobal } from '../../src'

describe('makeStoreGlobal', () => {
    it('should return undefined if no session storage exists', () => {
        (global as any).window = {}
        const store = createStore((s: any) => s)
        makeStoreGlobal(store, "foo")
        expect((global as any).window).to.eql({ foo: store })
    })
})
