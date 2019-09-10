/**
 * Module dependencies.
 */
// var util = require('util')
//   , OAuth2Strategy = require('passport-oauth2')
//   , Profile = require('./profile')
//   , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

import util from 'util';
import OAuth2Strategy from 'passport-oauth2';
import Profile from './profile';
import {InternalOAuthError} from 'passport-oauth2';


// Base Staging URL: https://staging.api.groundspeak.com
// Base Production URL: https://api.groundspeak.com

// Example Staging URL: https://oauth-staging.geocaching.com/token
// Example Production URL: https://oauth.geocaching.com/token 

// Authorize Staging URL : https://staging.geocaching.com/oauth/authorize.aspx
// Authorize Production URL : https://www.geocaching.com/oauth/authorize.aspx

var urls = {
  authorize: {
    'staging': 'https://staging.geocaching.com/oauth/authorize.aspx',
    'prod': 'https://www.geocaching.com/oauth/authorize.aspx',
  },
  token: {
    'staging': 'https://oauth-staging.geocaching.com/token',
    'prod': 'https://oauth.geocaching.com/token',
  },
  api: {
    'staging': 'https://staging.api.groundspeak.com',
    'prod': 'https://api.groundspeak.com',
  }
}


/**
 * `Strategy` constructor.
 *
 * The Geocaching authentication strategy authenticates requests by delegating to
 * Geocaching using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      identifies client to Geocaching
 *   - `clientSecret`   secret used to esablish ownership of the client key
 *   - `callbackURL`      URL to which Geocaching will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     (see XXX https://confluence.atlassian.com/display/Geocaching/OAuth+on+Geocaching#OAuthonGeocaching-Scopes for more info)
 *
 * Examples:
 *
 *     passport.use(new GeocachingStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/Geocaching/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.env = options.env || 'staging';
  options.scope = '*';
  options.client_id = options.clientID;
  options.redirect_uri = options.callbackURL;
  // options.code_challenge = undefined;
  // options.code_challenge_method = undefined;
  // options.state = 'djns57FdHY7TdCA98NBGgfc5hBH';
  options.response_type = 'code';
  options.authorizationURL = options.authorizationURL || urls.authorize[options.env];
  options.tokenURL = options.tokenURL || urls.token[options.env];
  options.customHeaders = options.customHeaders || {};
  // PKCE by default
  if (options.pkce){
    options.state = true;
    options.pkce = options.pkce; //can be true, S256, plain
  }

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-geocaching';
    //HACK: requests need to fall back to Basic Auth (for access_token call)
    options.customHeaders.Authorization = 'Basic ' + new Buffer(options.clientID + ':' + options.clientSecret).toString('base64');
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'geocaching';
  this._userProfileURL = options.userProfileURL || `${urls.api[options.env]}/v1/users/me?fields=username,referenceCode,membershipLevelId,avatarUrl,findCount,hideCount,favoritePoints,profileText`;
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Geocaching.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `Geocaching`
 *   - `id`               the user's Geocaching uuid
 *   - `username`         the user's Geocaching username
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on Geocaching
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider = 'Geocaching';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};


/**
 * Expose `Strategy`.
 */
// module.exports = Strategy;

export default Strategy;