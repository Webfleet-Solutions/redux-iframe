# About
This is a simple demo application for the `redux-iframe` library.

The demo consists of a content server, a shared library (`lib-common`), three modules
(`mod-consumer`, `mod-producer`, and `mod-solitary`), and an `application`. 
Besides of 3rd party libraries and two Redux [ducks](https://github.com/erikras/ducks-modular-redux)
provided by `lib-common`, no code is shared between modules and application.

The application uses React Router to switch between its "home" screen and the three modules.
With help of library [react-iframe](https://github.com/svenanders/react-iframe), the modules are loaded
into `<iframe>` tags by fetching their `index-*.html` pages from server. Each module is also able
to run standalone.

The `redux-iframe` library uses the Browser's event system (`postMessage` and `addEventListener`)
to dispatch Redux actions between the parent application and modules. The modules demonstrate different
use cases: 
* `mod-consumer` changes its color if a checkbox in the application menu is ticked.
* `mod-producer` has a checkbox that changes the color of the application menu.
* `mod-solitary` uses a local action and a local reducer to flip its own background color.

When `mod-consumer` and `mod-producer` are loaded, they initialize their state by coping
parts of the Redux state of the parent application. In contrast, `mod-solitary` does not care
about its parent's state. To retain its state between module changes, it copies its state to
local storage and restores it on reloading.

All five parts of the project are built independently with [rollup](https://rollupjs.org/guide/en/).
Application and modules can be updated and deployed independently as long as the interface
(action signatures and state of mentioned ducks) remain stable.

Note that 3rd party libraries (React, Redux...) are loaded by `<script>` tags in the `*.html`
documents. This is not a requirement, the libraries could as well be bundled with the application.
However, loading libraries via `<script>` tag has the advantage that the Browser caches them and
won't fetch them again when a module gets loaded.

# Install
```
yarn install
```

# Build
```
yarn build
```
This builds the shared library, all modules, and the  application.
It puts the results into folder [public/app](public/app).

# Run
```
yarn start
```
This starts a server at http://localhost:3000. Single modules are accessible by their `index-*.html` pages,
for example http://localhost:3000/index-solitary.html.
