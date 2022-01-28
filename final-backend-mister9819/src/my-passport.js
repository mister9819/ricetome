const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
            clientID: 'Redacted',
            clientSecret: 'Redacted',
            callbackURL: "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            // console.log(profile)
            let user = {
                'email': profile.emails[0].value,
                // 'name' : profile.name.givenName + ' ' + profile.name.familyName,
                'username': profile.emails[0].value.substr(0, profile.emails[0].value.indexOf("@")),
                'id'   : profile.id,
                // 'token': accessToken
            };

            return done(null, user);
        })
);
module.exports = (app) => {
    app.use(session({
        secret: 'doNotGuessTheSecret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Redirect the user to Google for authentication.  When complete,
    // Google will redirect the user back to the application at
    //     /auth/google/callback
    app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })); // could have a passport auth second arg {scope: 'email'}

    // Google will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
            // res.send(req.user);
            res.cookie("gcookie", req.user, { maxAge: 20000, httpOnly: true, secure: true, sameSite: "none"});
            res.redirect("https://ricetome.surge.sh/profile")
        });

}
