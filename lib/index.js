/**
 * Module dependencies.
 */
//var Strategy = require('./strategy-oauth');
var Strategy = require('./strategy-oauth2');

/**
 * Expose `Strategy` directly from package.
 */
//exports = module.exports = Strategy;
require('pkginfo')(module, 'version');

/**
 * Export constructors.
 */
exports.Strategy = Strategy;
