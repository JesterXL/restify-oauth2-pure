"use strict";

const makeSetup = require("../common/makeSetup");
const grantToken = require("./grantToken");

const grantTypes = "client_credentials";
const requiredHooks = ["grantClientToken", "authenticateToken"];

module.exports = makeSetup(grantTypes, requiredHooks, grantToken);
