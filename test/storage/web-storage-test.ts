import 'mocha'
import { expect } from 'chai'
import { AnyAction, createStore } from 'redux'
import { getStoredState, installStorageWriter, StorageType } from '../../src'

const ROOT_KEY = 'my-state'

describe('getStoredState', () => {
    it('should return undefined if no session storage exists', () => {
        (global as any).window = {}
        const result = getStoredState([])
        expect(result).to.be.undefined
    })

    it('should return undefined if no session storage exists', () => {
        (global as any).window = {}
        const result = getStoredState([], { storageType: StorageType.SESSION })
        expect(result).to.be.undefined
    })

    it('should return undefined if the root key does not exist', () => {
        createFakeWindowWithSessionStorage()
        const result = getStoredState([], { rootKey: 'WRONG_KEY' })
        expect(result).to.be.undefined
    })

    it('should return undefined if no substate key matches', () => {
        createFakeWindowWithSessionStorage({ foo: 123 })
        const result = getStoredState(['bar'], { rootKey: ROOT_KEY })
        expect(result).to.be.undefined
    })

    it('should return undefined on storage errors', () => {
        createFakeWindowThrowingErrors({ foo: 124 })
        const result = getStoredState(['foo'], { rootKey: ROOT_KEY })
        expect(result).to.be.undefined
    })

    it('should get the state from session storage', () => {
        createFakeWindowWithSessionStorage({ foo: 124, bar: 456, baz: 789 })
        const result = getStoredState(['foo', 'baz'], { rootKey: ROOT_KEY })
        expect(result).to.eql({ foo: 124, baz: 789 })
    })

    it('should get the state from local storage', () => {
        createFakeWindowWithLocalStorage({ foo: 124, bar: 456, baz: 789 })
        const result = getStoredState(['bar'], { rootKey: ROOT_KEY, storageType: StorageType.LOCAL })
        expect(result).to.eql({ bar: 456 })
    })
})

describe('installStorageWriter', () => {
    it('should return undefined if no session storage exists', () => {
        (global as any).window = {}
        const store = createStore((s: any) => s)
        const result = installStorageWriter(store, [])
        expect(result).to.be.undefined
    })

    it('should return undefined if no session storage exists', () => {
        (global as any).window = {}
        const store = createStore((s: any) => s)
        const result = installStorageWriter(store, [], { storageType: StorageType.SESSION })
        expect(result).to.be.undefined
    })

    it('should do nothing on storage errors', () => {
        const actionType = 'MY_ACTION'
        const store = createStore(createReducer(actionType))
        const storage = createFakeWindowThrowingErrors()
        installStorageWriter(store, ['foo'], { rootKey: ROOT_KEY })
        store.dispatch({ type: actionType, state: { foo: 124 } })

        expect(storage.getWriteCount()).to.equal(0)
    })

    it('should copy selected substate to session storage', () => {
        const actionType = 'MY_ACTION'
        const store = createStore(createReducer(actionType))
        const storage = createFakeWindowWithSessionStorage()
        installStorageWriter(store, ['foo', 'baz'], { rootKey: ROOT_KEY })

        store.dispatch({ type: actionType, state: { foo: 124, bar: 456, baz: 789 } })

        const result = storage.getItem(ROOT_KEY)
        expect(JSON.parse(result || '')).to.eql({ foo: 124, baz: 789 })
        expect(storage.getWriteCount()).to.equal(1)
    })

    it('should copy selected substate to local storage', () => {
        const actionType = 'MY_ACTION'
        const store = createStore(createReducer(actionType))
        const storage = createFakeWindowWithLocalStorage()
        installStorageWriter(store, ['bar'], { rootKey: ROOT_KEY, storageType: StorageType.LOCAL })

        store.dispatch({ type: actionType, state: { foo: 124, bar: 456, baz: 789 } })

        const result = storage.getItem(ROOT_KEY)
        expect(JSON.parse(result || '')).to.eql({ bar: 456 })
        expect(storage.getWriteCount()).to.equal(1)
    })

    it('should memoize selected substate', () => {
        const actionType = 'MY_ACTION'
        const store = createStore(createReducer(actionType))
        const storage = createFakeWindowWithSessionStorage()
        installStorageWriter(store, ['foo', 'baz'], { rootKey: ROOT_KEY })

        // Only the first, middle, and last actions lead to storage updates.
        // The 2nd one is ignored because the value did not change.
        // The 4th one is ignored because its key is not in the filter list.
        store.dispatch({ type: actionType, state: { foo: 124 } })
        store.dispatch({ type: actionType, state: { foo: 124 } })
        store.dispatch({ type: actionType, state: { foo: 125 } })
        store.dispatch({ type: actionType, state: { bar: 456 } })
        store.dispatch({ type: actionType, state: { baz: 789 } })

        const result = storage.getItem(ROOT_KEY)
        expect(JSON.parse(result || '')).to.eql({ foo: 125, baz: 789 })
        expect(storage.getWriteCount()).to.equal(3)
    })
})

const createReducer = (actionType: string) => (
    (s: any, a: AnyAction) => a.type === actionType ? Object.assign({}, s, a.state) : s
)

class StorageMock {
    private readonly store: { [k: string]: string }
    private readonly throwError: boolean
    private writeCount: number
    constructor(initialState: Object | null, throwError: boolean) {
        this.store = initialState ? { [ROOT_KEY]: JSON.stringify(initialState) } : {}
        this.throwError = throwError
        this.writeCount = 0
    }
    getItem(key: string): string | null {
        if (this.throwError) {
            throw new Error("bang")
        }
        return this.store[key] || null
    }
    setItem(key: string, value: string) {
        if (this.throwError) {
            throw new Error("bang")
        }
        this.store[key] = value
        ++this.writeCount
    }
    getWriteCount() {
        return this.writeCount
    }
}

const createFakeWindowWithLocalStorage = (initialState: Object | null = null): StorageMock => {
    const localStorage = new StorageMock(initialState, false)
    ;(global as any).window = { localStorage }
    return localStorage
}

const createFakeWindowWithSessionStorage = (initialState: Object | null = null): StorageMock => {
    const sessionStorage = new StorageMock(initialState, false)
    ;(global as any).window = { sessionStorage }
    return sessionStorage
}

const createFakeWindowThrowingErrors = (initialState: Object | null = null): StorageMock => {
    const sessionStorage = new StorageMock(initialState, true)
    ;(global as any).window = { sessionStorage }
    return sessionStorage
}
