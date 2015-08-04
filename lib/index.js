/**
 * Module dependencies.
 */
var Strategy = require('./strategy');


/**
 * Expose `Strategy` directly from package.
 */
//exports = module.exports = Strategy;
require('pkginfo')(module, 'version');

/**
 * Export constructors.
 */
exports.Strategy = Strategy;
