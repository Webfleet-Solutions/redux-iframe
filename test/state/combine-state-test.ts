import 'mocha'
import { expect } from 'chai'
import { combineState } from '../../src'

describe('combineState', () => {
    it('should return undefined if called without parameters', () => {
        const result = combineState()
        expect(result).to.be.undefined
    })

    it('should return undefined if called with undefined', () => {
        const result = combineState(undefined)
        expect(result).to.be.undefined
    })

    it('should return the second argument if the first argument is undefined', () => {
        const state2 = { foo: 'bar' }
        const result = combineState(undefined, state2)
        expect(result).to.eql(state2)
    })

    it('should return the second argument if both argument have the same key', () => {
        const state1 = { foo: 'bar' }
        const state2 = { foo: 'baz' }
        const result = combineState(state1, state2)
        expect(result).to.eql(state2)
    })

    it('should merge complex objects', () => {
        const state1 = {
            foo: 'bar',
            bar: 123
        }
        const state2 = {
            bar: { flag: true },
            baz: { num: 456 }
        }
        const expected = Object.assign({}, state1, state2)
        const result = combineState(state1, state2)
        expect(result).to.eql(expected)
    })
})
