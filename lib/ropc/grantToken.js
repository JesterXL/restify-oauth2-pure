"use strict";

const validateGrantTokenRequest = require("../common/validateGrantTokenRequest");
const finishGrantingToken = require("../common/finishGrantingToken");
const makeOAuthError = require("../common/makeOAuthError");

const grantToken = (req, res, next, options) => {
    const sendUnauthorizedError = (type, description) => {
        res.header("WWW-Authenticate", "Basic realm=\"" + description + "\"");
        next(makeOAuthError("Unauthorized", type, description));
    };

    if (!validateGrantTokenRequest("password", req, next)) {
        return;
    }

    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
        return next(makeOAuthError("BadRequest", "invalid_request", "Must specify username field."));
    }

    if (!password) {
        return next(makeOAuthError("BadRequest", "invalid_request", "Must specify password field."));
    }

    const clientId = req.authorization.basic.username;
    const clientSecret = req.authorization.basic.password;
    const clientCredentials = { clientId: clientId, clientSecret: clientSecret };

    options.hooks.validateClient(clientCredentials, req, (error, result) => {
        if (error) {
            return next(error);
        }

        if (!result) {
            return sendUnauthorizedError("invalid_client", "Client ID and secret did not validate.");
        }

        const allCredentials = { clientId, clientSecret, username, password };
        options.hooks.grantUserToken(allCredentials, req, (error, token) => {
            if (error) {
                return next(error);
            }

            if (!token) {
                return sendUnauthorizedError("invalid_grant", "Username and password did not authenticate.");
            }

            const allCredentials = {
                clientId: clientId,
                clientSecret: clientSecret,
                username: username,
                password: password,
                token: token
            };
            finishGrantingToken(allCredentials, token, options, req, res, next);
        });
    });
};

module.exports = grantToken;