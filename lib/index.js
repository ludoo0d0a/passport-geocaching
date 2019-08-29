/**
 * Module dependencies.
 */
//var Strategy = require('./strategy-oauth');
// var Strategy = require('./strategy-oauth2');
import Strategy from './strategy-oauth2';
// const Strategy= function(){}

/**
 * Expose `Strategy` directly from package.
 */
//exports = module.exports = Strategy;
// require('pkginfo')(module, 'version');

/**
 * Export constructors.
 */
// exports.Strategy = Strategy;
export default Strategy
