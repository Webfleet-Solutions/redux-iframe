# 1.0.0
Support for session storage (default) and local storage.

**Breaking changes**:
* The _default_ storage changed from [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage)
to [sessionStorage](https://developer.mozilla.org/docs/Web/API/Window/sessionStorage).
* The _default_ name of the key in the Brower's [key-value store](https://developer.mozilla.org/docs/Web/API/Storage)
(either session or local storage) changed from "state" to "redux-iframe-state".  
* The second argument of functions `getStoredState` and `installStorageWriter` changed from type `string`
to a parameter object, which allows to set the storage type and the storage key
(see documentation in [README.md](README.md) and [web-storage.ts](src/storage/web-storage.ts)).

# 0.7.0

# 0.6.0

# 0.5.4
First published version (experimental)
