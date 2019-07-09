# passport-geocaching
Geocaching authentication strategy for Passport and Node.js.

[Passport](http://passportjs.org/) strategy for authenticating with [Geocaching](http://www.geocaching.com/)
using the OAuth 2 API.

This module lets you authenticate using Geocaching in your Node.js applications.
By plugging into Passport, Geocaching authentication can be easily and
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
        clientID: GEOCACHING_CONSUMER_KEY,
        clientSecret: GEOCACHING_SECRET_KEY,
        callbackURL: "http://127.0.0.1:3000/auth/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ geocachingId: profile.id, geocachingUsername: profile.username }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Groundspeak registration

You need API key to access [geocaching API](https://apidevelopers.geocaching.com/).
And you need to register the callback urls, including in local mode with localhost. Please contact support to add them.


#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'geocaching'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/geocaching',
      passport.authenticate('geocaching'));
    
    app.get('/auth/callback', 
      passport.authenticate('geocaching', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/ludoo0d0a/passport-geocaching/tree/master/examples/login).

For a complete integration of this stratgy, look at [geocaching-api](https://github.com/ludoo0d0a/geocaching-api)

## Tests

    $ cd examples/login
    $ npm install
    $ npm start


## Credits

  - [Ludovic Valente](http://github.com/ludoo0d0a)

## License

[The ISC License](http://opensource.org/licenses/ISC)

Copyright (c) 2019 Ludovic Valente <[http://www.geoking.fr/](http://www.geoking.fr)>
