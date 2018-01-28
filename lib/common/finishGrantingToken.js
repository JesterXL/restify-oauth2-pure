"use strict";

const { has } = require('lodash/fp');
const makeOAuthError = require("./makeOAuthError");

const finishGrantingToken = (allCredentials, token, options, req, res, next) => {
    let shouldIncludeScopeInResponse = false;
    let scopesRequested = [];
    if (has("scope", req.body)) {
        if (typeof req.body.scope !== "string") {
            let message = "The scope value must be a space-delimited string, if present.";
            return next(makeOAuthError("BadRequest", "invalid_scope", message));
        }
        shouldIncludeScopeInResponse = true;
        scopesRequested = req.body.scope.split(" ");
    }

    options.hooks.grantScopes(allCredentials, scopesRequested, req, (error, scopesGranted) => {
        if (error) {
            return next(error);
        }

        if (!scopesGranted) {
            let message = "The requested scopes are invalid, unknown, or exceed the set of scopes appropriate for " +
                          "these credentials.";
            return next(makeOAuthError("BadRequest", "invalid_scope", message));
        }

        if (scopesGranted === true) {
            scopesGranted = scopesRequested;
        }

        let responseBody = {
            access_token: token,
            token_type: "Bearer",
            expires_in: options.tokenExpirationTime
        };
        if (shouldIncludeScopeInResponse) {
            responseBody.scope = scopesGranted.join(" ");
        }

        res.send(responseBody);
        next();
    });
};

module.exports = finishGrantingToken;