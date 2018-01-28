"use strict";

const errors = require('restify-errors');

const makeOAuthError = (errorClass, errorType, errorDescription) => {
    const body = { error: errorType, error_description: errorDescription };
    return new errors[errorClass + "Error"]({ message: errorDescription, body: body });
};

module.exports = makeOAuthError;