import 'mocha'
import { expect } from 'chai'
import { filterState } from '../../src/state/filter-state'

describe('filterState', () => {
    it('should return undefined if called with undefined', () => {
        const result = filterState(undefined, [])
        expect(result).to.be.undefined
    })

    it('should return undefined if no keys are given', () => {
        const state = { foo: 123 }
        const result = filterState(state, [])
        expect(result).to.be.undefined
    })

    it('should filter by given keys', () => {
        const state = { foo: 123, bar: 456, baz: 789 }
        const result = filterState(state, ['foo', 'baz'])
        expect(result).to.eql({ foo: 123, baz: 789 })
    })

    it('should accept superfluous key', () => {
        const state = { bar: 123 }
        const result = filterState(state, ['foo', 'bar', 'baz'])
        expect(result).to.eql(state)
    })
})
