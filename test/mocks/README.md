# Mocking

It's important to mock Providers so that functional tests don't reach out to actual third party services. The basic template for a mocked provider is:

```javascript
const getProvider = require('../../../src/providers/<NAME>Provider').default
const td = require('testdouble')

const <NAME>Provider = (options) => {
  const provider = getProvider(options)

  // @SETUP: Add methods you need to mock for HttpService here
  td.replace(provider, '<METHOD NAME TO STUB>')

  return provider
}

module.exports = <NAME>Provider
```

* Every file in `src/providers` should be mocked in `test/mocks/providers`
* Every file in `test/mocks/providers` should return a function that returns the actual provider instance.
* The file name of the mock must match the name of the exported function. (case-insensitive)
* 