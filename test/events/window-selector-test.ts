import 'mocha'
import { expect } from 'chai'
import { createIframeContentWindowSelector } from '../../src/events/window-selector'

describe('windowSelector', () => {
    it('should return the iframe content window', () => {
        const iframe = 'my-frame'
        createFakeDocument(iframe, { contentWindow: 123 })
        const selector = createIframeContentWindowSelector(iframe)
        expect(selector()).to.equal(123)
    })

    it('should return null if iframe does not exist', () => {
        const iframe = 'my-frame'
        createFakeDocument(iframe, null)
        const selector = createIframeContentWindowSelector(iframe)
        expect(selector()).to.be.null
    })

    it('should return null if iframe does not have a content window', () => {
        const iframe = 'my-frame'
        createFakeDocument(iframe, {})
        const selector = createIframeContentWindowSelector(iframe)
        expect(selector()).to.be.null
    })
})

const createFakeDocument = (iframe: string, element: Object | null = null) => {
    (global as any).document = {
        getElementById(elementId: string) {
            expect(elementId).to.eql(iframe)
            return element
        }
    }
}
