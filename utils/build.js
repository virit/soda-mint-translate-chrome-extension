import webpack from 'webpack'
import config from '../webpack.config.js'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'
process.env.ASSET_PATH = '/'

delete config.chromeExtensionBoilerplate

config.mode = 'production'

webpack(config, function (err) {
  if (err) throw err;
});
