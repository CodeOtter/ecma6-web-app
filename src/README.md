# Application Development

* `config.js` contains the order and configuration of auto-loading dependencies, the order of service dependency loading to prevent circular references, and individual `.env` values that are used in various dependencies.
* `container.js` contains helper functions to easily leverage [Awilix's](https://github.com/jeffijoe/awilix) dependency injection methods.
* `dependencies.js` is responsible for auto-loading class dependencies into the Awilix's application container.
* `app.js` starts the AppService, which starts the application.
* `index.js` is the bootstrap to start the application.