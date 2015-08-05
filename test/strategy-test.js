var vows = require('vows');
var assert = require('assert');
var util = require('util');
//var GeocachingStrategy = require('passport-geocaching').Strategy
var GeocachingStrategy = require(__dirname + '/../lib/index').Strategy;

var suite = vows.describe('GeocachingStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new GeocachingStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
    },
    
    'should be named geocaching': function (strategy) {
      assert.equal(strategy.name, 'geocaching');
    }
  },

  'strategy when loading user profile': {
    topic: function() {
      var strategy = new GeocachingStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      //strategy._oauth.get = function(url, token, tokenSecret, callback) {
      strategy._oauth.post = function(url, token, tokenSecret, body, contenttype, callback) {
        var o = { 
           Status: {
              StatusCode: 0,
              StatusMessage: "OK",
              ExceptionDetails: ""
           },
           Profile: {
             User: {
               AvatarUrl: "https://d1qqxh9zzqprtj.cloudfront.net/gcstage/avatar/xxx",
               FindCount: 2187,
               GalleryImageCount: 28,
               HideCount: 5,
               HomeCoordinates: {
                 Latitude: 49.49,
                 Longitude: 6.16
               },
               Id: 4616374,
               IsAdmin: false,
               MemberType: {
                 MemberTypeId: 3,
                 MemberTypeName: "Premium"
               },
               PublicGuid: "652dd7f7-155d-4177-9063-123456789",
               UserName: "ludoo"
             }
           } 
        };
        var body = JSON.stringify(o);
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'geocaching');
        assert.equal(profile.username, 'ludoo');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      }
    }
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new GeocachingStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      //strategy._oauth.get = function(url, token, tokenSecret, callback) {
      strategy._oauth.post = function(url, token, tokenSecret, body, contenttype, callback) {
        callback(new Error('something went wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      }
    }
  }

});
suite.run();
//suite.export(module);