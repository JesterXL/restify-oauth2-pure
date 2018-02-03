"use strict";

const { has, isObject, negate, isNil } = require('lodash/fp');
const makeOAuthError = require("./makeOAuthError");
const isNotObject = negate(isObject);

const sendBadRequestError = (type, description, next) => next(makeOAuthError("BadRequest", type, description));

const validateGrantTokenRequest = (grantType, req, next) => {
    if (isNil(req) || isNil(req.body) || isNotObject(req.body)) {
        sendBadRequestError("invalid_request", "Must supply a body.", next);
        return false;
    }

    if (!has("grant_type", req.body)) {
        sendBadRequestError("invalid_request", "Must specify grant_type field.", next);
        return false;
    }

    if (req.body.grant_type !== grantType) {
        sendBadRequestError("unsupported_grant_type", `Only grant_type=${grantType} is supported.`, next);
        return false;
    }

    if (!req.authorization || !req.authorization.basic) {
        sendBadRequestError("invalid_request", "Must include a basic access authentication header.", next);
        return false;
    }

    if (has("scope", req.body)) {
        if (typeof req.body.scope !== "string") {
            sendBadRequestError("invalid_request", "Must specify a space-delimited string for the scope field.", next);
            return false;
        }
    }

    return true;
};

module.exports = validateGrantTokenRequest;