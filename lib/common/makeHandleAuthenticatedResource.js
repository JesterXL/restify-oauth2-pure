"use strict";

const hasBearerToken = req =>
    req.authorization && req.authorization.scheme === "Bearer" && req.authorization.credentials.length > 0;


const getBearerToken = req =>
    hasBearerToken(req) ? req.authorization.credentials : null;

const makeHandleAuthenticatedResource = errorSenders => {
    const handleAuthenticatedResource = (req, res, next, options) => {
        var token = getBearerToken(req);
        if (!token) {
            return errorSenders.tokenRequired(res, next, options);
        }

        req.pause();
        options.hooks.authenticateToken(token, req, function (error, authenticated) {
            req.resume();

            if (error) {
                return errorSenders.sendWithHeaders(res, next, options, error);
            }

            if (!authenticated) {
                return errorSenders.tokenInvalid(res, next, options);
            }

            next();
        });
    };
    return handleAuthenticatedResource;
};

module.exports = makeHandleAuthenticatedResource;