"use strict";

const makeSetup = require("../common/makeSetup");
const grantToken = require("./grantToken");

const grantTypes = "password";
const requiredHooks = ["validateClient", "grantUserToken", "authenticateToken"];

module.exports = makeSetup(grantTypes, requiredHooks, grantToken);
