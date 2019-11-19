/**
 * Marker to monkey-patch actions received via postMessage events.
 * Such actions will not be sent again by the event-sender middleware to avoid cycles.
 * Instead, the event-sender middleware will delete the marker.
 */
export const EVENT_MARKER = '__redux_iframe_event__'
