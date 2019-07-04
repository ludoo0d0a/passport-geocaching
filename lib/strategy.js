/**
 * Module dependencies.
 */
var util = require('util'),
  OAuthStrategy = require('passport-oauth').OAuthStrategy,
  InternalOAuthError = require('passport-oauth').InternalOAuthError,
  Profile = require('./profile');

// Documentation
// Live : https://api.groundspeak.com/LiveV6/geocaching.svc/help
// Staging : https://staging.api.groundspeak.com/Live/v6beta/geocaching.svc/help
// Webservice
// Live : https://api.groundspeak.com/LiveV6/geocaching.svc?singleWsdl
// Staging : https://staging.api.groundspeak.com/Live/V6Beta/geocaching.svc?singleWsdl

var urls = {
  request_token: {
    'staging'     : 'https://staging.geocaching.com/OAuth/oauth.ashx',
    'live'        : 'https://www.geocaching.com/OAuth/oauth.ashx',
    'live_mobile' : 'https://www.geocaching.com/OAuth/mobileoauth.ashx'
  },
  api: {
    'staging'     : 'https://staging.api.groundspeak.com/Live/V6Beta/geocaching.svc/%s',
    'live'        : 'https://api.groundspeak.com/LiveV6/geocaching.svc/%s',
    'live_mobile' : 'https://api.groundspeak.com/LiveV6/geocaching.svc/%s'
  }
}

/**
 * `Strategy` constructor.
 *
 * The geocaching authentication strategy authenticates requests by delegating to
 * geocaching using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to geocaching
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which geocaching will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new geocachingStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/geocaching/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
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
  this.env = options.env;
  
  options.requestTokenURL = options.requestTokenURL || urls.request_token[options.env];
  options.accessTokenURL = options.accessTokenURL || options.requestTokenURL;
  options.userAuthorizationURL = options.userAuthorizationURL || options.requestTokenURL;
  options.sessionKey = options.sessionKey || 'oauth:geocaching';
  
  options.consumerKey = options.consumerKey;
  options.consumerSecret = options.consumerSecret;

  OAuthStrategy.call(this, options, verify);
  this.name = 'geocaching';
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
 * Retrieve user profile from geocaching.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`
 *   - `displayName`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  var url = util.format(urls.api[this.env], 'GetYourUserProfile') + '?format=json';

  var post_body = {
    AccessToken: token,
    ProfileOptions:{
  		PublicProfileData: true,
  		EmailData: true
  		// ChallengesData: false,
  		// FavoritePointsData: false,
  		// GeocacheData: false,
  		// SouvenirData: false,
  		// TrackableData: false
  	},
  	DeviceInfo: {
      ApplicationCurrentMemoryUsage: 2048*1024,
      ApplicationPeakMemoryUsage: 2048*1024,
      ApplicationSoftwareVersion: 'blaa',
      DeviceManufacturer: 'blaa',
      DeviceName: 'blaa',
      DeviceOperatingSystem: 'blaa',
      DeviceTotalMemoryInMB: 2048*1024,
      DeviceUniqueId: 'blaa',
      MobileHardwareVersion: 'blaa',
      WebBrowserVersion: 'blaa'
    }
  };

  
  this._oauth.post(url, token, tokenSecret, JSON.stringify(post_body), 'application/json', function (err, body, res) {

    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      if (json.Status && (json.Status.StatusCode === 141 || json.Status.StatusCode === 2)) {
        throw new InternalOAuthError('failed to fetch user profile', json.Status.StatusMessage);
      }
      
      var profile = Profile.parse(json);
      profile.provider = 'geocaching';
      profile._raw = body;
      profile._json = json;
    
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
