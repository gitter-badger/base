'use strict';

import express from 'express';
import passport from 'passport';
import UserRepository from '../repos/user-repository.js';
import SessionRepository from '../repos/session-repository.js';
import RandomizerService from '../services/randomizer-service.js';
import ProviderLookup from '../auth/provider-lookup.js';

var router = express.Router();

//The authentication url
router.get('/connect', passport.authenticate('google', { scope:
    [ 'https://www.googleapis.com/auth/plus.login'] }));

//callback route after successful google authentication
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: "/error" }),
    function(req, res) {

        var googleUser = req.user;
        var user = googleUser.user;
        var access_token = googleUser.access_token;
        var googleUserId = googleUser.googleUserId;

        var sessionRepo = new SessionRepository();
        sessionRepo.createSession(user.id, user.emailAddress, access_token, ProviderLookup.Google, googleUserId)
          .then(function(session){

            //This call back will render the index page on the callback route.
            //View the app.js file for the route mapping for /google/callback.
            //check out http://adeper.io/2015/06/tokens-express-react-how-to-get-your-bearer-token-from-the-server-to-the-client/
            //for why we use the express render method to send up the access token to the client
            res.render('index', {
                                    access_token: session.base_access_token,
                                    email_address: session.email_address
                                });
          }).catch(function(e){
            res.redirect('/error');
          });
    }
);


module.exports = router;
