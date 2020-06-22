process.on('uncaughtException', function(err) {
  console.error(err);
});

require = require('esm')(module)
require('./config')
require('./dependencies')
require('./app')
