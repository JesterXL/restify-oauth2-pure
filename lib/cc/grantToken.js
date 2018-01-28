"use strict";

const validateGrantTokenRequest = require("../common/validateGrantTokenRequest");
const finishGrantingToken = require("../common/finishGrantingToken");
const makeOAuthError = require("../common/makeOAuthError");

const grantToken = (req, res, next, options) => {
    if (!validateGrantTokenRequest("client_credentials", req, next)) {
        return;
    }

    var clientId = req.authorization.basic.username;
    var clientSecret = req.authorization.basic.password;
    var credentials = { clientId: clientId, clientSecret: clientSecret };

    options.hooks.grantClientToken(credentials, req, function (error, token) {
        if (error) {
            return next(error);
        }

        if (!token) {
            res.header("WWW-Authenticate", "Basic realm=\"Client ID and secret did not authenticate.\"");
            return next(makeOAuthError("Unauthorized", "invalid_client", "Client ID and secret did not authenticate."));
        }

        var allCredentials = { clientId: clientId, clientSecret: clientSecret, token: token };
        finishGrantingToken(allCredentials, token, options, req, res, next);
    });
};

module.exports = grantToken;