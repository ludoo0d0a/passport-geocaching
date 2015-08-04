var vows = require('vows');
var assert = require('assert');
var util = require('util');
var geocaching = require('../lib/index');
//var geocaching = require('passport-geocaching');


vows.describe('passport-geocaching').addBatch({

    'should report a version': function (x) {
      assert.isString(geocaching.version);
    }

}).export(module);