"use strict";

const validateGrantTokenRequest = require("../common/validateGrantTokenRequest");
const finishGrantingToken = require("../common/finishGrantingToken");
const makeOAuthError = require("../common/makeOAuthError");
const { get } = require('lodash/fp');

const sendUnauthorizedError = (type, description, next) => {
    res.header("WWW-Authenticate", `Basic realm="${description}"`);
    next(makeOAuthError("Unauthorized", type, description));
};

const grantToken = (req, res, next, options) => {
    if (!validateGrantTokenRequest("password", req, next)) {
        return;
    }

    const username = get('body.username', req);
    const password = get('body.password', req);

    if (!username) {
        return next(makeOAuthError("BadRequest", "invalid_request", "Must specify username field."));
    }

    if (!password) {
        return next(makeOAuthError("BadRequest", "invalid_request", "Must specify password field."));
    }

    const clientId = get('authorization.basic.username', req);
    const clientSecret = get('authorization.basic.password', req);
    const clientCredentials = { clientId, clientSecret };

    options.hooks.validateClient(clientCredentials, req, (error, result) => {
        if (error) {
            return next(error);
        }

        if (!result) {
            return sendUnauthorizedError("invalid_client", "Client ID and secret did not validate.", next);
        }

        const allCredentials = { clientId, clientSecret, username, password };
        options.hooks.grantUserToken(allCredentials, req, (error, token) => {
            if (error) {
                return next(error);
            }

            if (!token) {
                return sendUnauthorizedError("invalid_grant", "Username and password did not authenticate.", next);
            }

            const allCredentials = {
                clientId,
                clientSecret,
                username,
                password,
                token
            };
            return finishGrantingToken(allCredentials, token, options, req, res, next);
        });
    });
};

module.exports = grantToken;