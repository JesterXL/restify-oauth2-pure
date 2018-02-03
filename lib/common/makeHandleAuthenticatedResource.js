"use strict";

const { isNil, negate, has, get, partialRight } = require('lodash/fp');
const exists = negate(isNil);
const union = require('folktale/adt/union/union');

const HandleAuthenticatedResourceResponse = union('HandleAuthenticatedResourceResponse', {
    TokenRequired() { return {toString: ()=> 'TokenRequired'} },
    TokenAuthenticationError() { return {toString: ()=> 'TokenAuthenticationError'} },
    TokenInvalid() { return {toString: ()=> 'TokenInvalid'} },
    Handled() { return {toString: ()=> 'Handled'} }
});
const { TokenRequired, TokenAuthenticationError, TokenInvalid, Handled } = HandleAuthenticatedResourceResponse;

const hasBearerToken = req =>
    exists(req)
    && has('authorization', req) 
    && get('authorization.scheme', req) === "Bearer" 
    && has('authorization.credentials', req)
    && req.authorization.credentials.length > 0;

const getBearerToken = req =>
    hasBearerToken(req) ? req.authorization.credentials : null;

const handleAuthenticatedResource = (req, res, next, options, tokenRequired, sendWithHeaders, tokenInvalid) =>
    new Promise( success => {
        // console.log("options:", options);
        const token = getBearerToken(req);
        // console.log("token:", token);
        if (!token) {
            tokenRequired(res, next, options);
            return success(TokenRequired());
        }
        // console.log("ok, we have a token, pausing...");

        req.pause();
        return options.hooks.authenticateToken(token, req, (error, authenticated) => {
            // console.log("authenticateToken");
            req.resume();

            if (error) {
                sendWithHeaders(res, next, options, error);
                return success(TokenAuthenticationError());
            }

            if (!authenticated) {
                tokenInvalid(res, next, options, undefined);
                return success(TokenInvalid());
            }

            next();
            return success(Handled());
        });
    });

const makeHandleAuthenticatedResource = errorSenders =>
    partialRight(handleAuthenticatedResource, [
        errorSenders.tokenRequired, 
        errorSenders.sendWithHeaders, 
        errorSenders.tokenInvalid
    ]);

module.exports = {
    hasBearerToken,
    getBearerToken,
    handleAuthenticatedResource,
    HandleAuthenticatedResourceResponse,
    makeHandleAuthenticatedResource
};