# passport-geocaching
Geocaching authentication strategy for Passport and Node.js.

[Passport](http://passportjs.org/) strategy for authenticating with [Geocaching](http://www.geocaching.com/)
using the OAuth 1.0a API.

This module lets you authenticate using Tumblr in your Node.js applications.
By plugging into Passport, Tumblr authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-geocaching

## Usage

#### Configure Strategy

The Geocaching authentication strategy authenticates users using a Geocaching account
and OAuth tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a consumer key, consumer secret, and callback URL.

    passport.use(new GeocachingStrategy({
        consumerKey: GEOCACHING_CONSUMER_KEY,
        consumerSecret: GEOCACHING_SECRET_KEY,
        callbackURL: "http://127.0.0.1:3000/auth/geocaching/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ geocachingId: profile.id, geocachingUsername: profile.username }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'geocaching'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/geocaching',
      passport.authenticate('geocaching'));
    
    app.get('/auth/geocaching/callback', 
      passport.authenticate('geocaching', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/ludoo0d0a/passport-geocaching/tree/master/examples/login).

For a complete integration of this stratgy, look at [geocaching-api](https://github.com/ludoo0d0a/geocaching-api)

## Tests

    $ npm install --dev
    $ make test


## Credits

  - [Ludovic Valente](http://github.com/ludoo0d0a)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Ludovic Valente <[http://www.pitaso.com/](http://www.pitaso.com)>
