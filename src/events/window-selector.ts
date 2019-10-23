export type WindowSelector = () => Window | null

/**
 * Function selects the parent window.
 */
export const parentWindowSelector: WindowSelector = () => window.parent

/**
 * Creates a selector for the content window of an iframe with the given id.
 * Returns null if no such iframe was found.
 */
export const createIframeContentWindowSelector = (iFrameId: string): WindowSelector => {
    return (): Window | null => {
        const element: Element | null = document.getElementById(iFrameId)
        if (element) {
            const iframe: HTMLIFrameElement = element as HTMLIFrameElement
            if (iframe.contentWindow) {
                return iframe.contentWindow
            }
        }
        return null
    }
}


