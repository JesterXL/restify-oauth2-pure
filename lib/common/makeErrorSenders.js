"use strict";

const errors = require('restify-errors');
const partialRight = require('lodash/fp/partialRight');

const statusCodesToErrorCodes = {
    400: "invalid_request",
    401: "invalid_token"
};

const setLinkHeader = (res, options, grantTypes) => {
    res.header("Link",
        `<${options.tokenEndpoint}>; rel="oauth2-token"; 
        grant-types="${grantTypes}"; token-types="bearer"`);
};

const setWwwAuthenticateHeader = (res, options, error) => {
    res.header("WWW-Authenticate",
        `Bearer realm="${options.wwwAuthenticateRealm}",
        error="${statusCodesToErrorCodes[error.statusCode]}", 
        error_description="${error.messsage}" 
        `);
};

const setWwwAuthenticateHeaderWithoutErrorInfo = (res, options) => {
    // See http://tools.ietf.org/html/rfc6750#section-3.1: "If the request lacks any authentication information
    // (e.g., the client was unaware that authentication is necessary or attempted using an unsupported
    // authentication method), the resource server SHOULD NOT include an error code or other error information."
    res.header("WWW-Authenticate", `Bearer realm="${options.wwwAuthenticateRealm}"`);
};

const sendWithHeaders = (res, next, options, error, grantTypes) => {
    if (error.statusCode in statusCodesToErrorCodes) {
        setLinkHeader(res, options, grantTypes);
        setWwwAuthenticateHeader(res, options, error);
    }
    next(error);
};

const sendAuthenticationRequired = (res, next, options, error, grantTypes) => {
    setLinkHeader(res, options, grantTypes);
    setWwwAuthenticateHeaderWithoutErrorInfo(res, options);
    next(error);
};

const sendInsufficientAuthorization = (res, next, options, error, grantTypes) => {
    setLinkHeader(res, options, grantTypes);
    next(error);
};

const tokenRequired = (res, next, options, message, grantTypes) => {
    if (message === undefined) {
        message = "Bearer token required. Follow the oauth2-token link to get one!";
    }

    sendWithHeaders(res, next, options, new errors.BadRequestError(message), grantTypes);
};

const authenticationRequired = (res, next, options, message, grantTypes) => {
    if (message === undefined) {
        message = "Authentication via bearer token required. Follow the oauth2-token link to get one!";
    }

    sendAuthenticationRequired(res, next, options, new errors.UnauthorizedError(message), grantTypes);
};

const insufficientAuthorization = (res, next, options, message, grantTypes) => {
    if (message === undefined) {
        message = "Insufficient authorization. Follow the oauth2-token link to get a token with more " +
                  "authorization!";
    }

    sendInsufficientAuthorization(res, next, options, new errors.ForbiddenError(message), grantTypes);
};

const tokenInvalid = (res, next, options, message, grantTypes) => {
    if (message === undefined) {
        message = "Bearer token invalid. Follow the oauth2-token link to get a valid one!";
    }

    sendWithHeaders(res, next, options, new errors.UnauthorizedError(message), grantTypes);
};

const makeErrorSenders = grantTypes => {

    return {
        sendWithHeaders: partialRight(sendWithHeaders, [grantTypes]),
        tokenRequired: partialRight(tokenRequired, [grantTypes]),
        authenticationRequired: partialRight(authenticationRequired, [grantTypes]),
        insufficientAuthorization: partialRight(insufficientAuthorization, [grantTypes]),
        tokenInvalid: partialRight(tokenInvalid, [grantTypes]),
    };
};

module.exports = {
    statusCodesToErrorCodes,
    setLinkHeader,
    setWwwAuthenticateHeader,
    setWwwAuthenticateHeaderWithoutErrorInfo,
    sendWithHeaders,
    sendAuthenticationRequired,
    sendInsufficientAuthorization,

    tokenRequired,
    authenticationRequired,
    insufficientAuthorization,
    tokenInvalid,

    makeErrorSenders
};