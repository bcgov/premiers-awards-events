/*!
 * Client Authentication
 * File: auth.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

const axios = require("axios");
require("dotenv").config();

("use strict");

// initialization settings
const nodeEnv = process.env.NODE_ENV;
const baseURL = process.env.PA_APPS_BASE_URL;
const apiURL = process.env.PA_APPS_API_URL;
const superadminGUID = process.env.SUPER_ADMIN_GUID;
const superadminUser = process.env.SUPER_ADMIN_USER;

/**
 * Authenticate user based on IDIR credentials.
 * - retrieves current session data from SAML authenticator
 * - returns user data to client in session cookies
 *
 * @param req
 * @param res
 * @param {Array} allowedRoles
 * @src public
 */

exports.authenticate = async (req, res, next) => {
  try {
    // [dev] skip authentication on test/local environments
    // - set to locally defined test admin user
    if (nodeEnv === "local" || nodeEnv === "test") {
      // call API - user data endpoint
      let response = await axios.get(
        `${apiURL}/admin/users/view/${superadminGUID}`
      );
      const { data = {} } = response || {};
      const { guid = "", username = "" } = data || {};
      res.locals.user = { guid: guid, username: username };
      // check that test admin user has been initialized
      if (!superadminGUID || !superadminUser || !guid || !username)
        return next(new Error("noTestInit"));
      return next();
    }

    // get current user data (if authenticated)
    const { session = null, SMSESSION = "" } = req.cookies || {};
    let date = new Date();
    const expDays = 1;
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    const SMSCookie =
      "SMSESSION=" +
      SMSESSION +
      "; " +
      expires +
      "; path=/; HttpOnly; Secure=true;";
    const SessionCookie =
      "session=" +
      session +
      "; " +
      expires +
      "; path=/; HttpOnly; Secure=true;";

    // call SAML API - user data endpoint
    let response = await axios.get(`${baseURL}/user_info`, {
      headers: {
        Cookie: `${SessionCookie} ${SMSCookie}`,
      },
    });

    // handle response
    const { data = {} } = response || {};
    const { SMGOV_GUID = [null], username = [null] } = data || {};

    // test that tokens exist
    if (!data || !SMGOV_GUID[0] || !username[0])
      return next(new Error("noAuth"));

    // reformat guest user data
    // - store user data in response for downstream middleware
    res.locals.user = {
      guid: SMGOV_GUID[0],
      username: username[0],
      role: "visitor",
    };
    return next();
  } catch (err) {
    return next(err);
  }
};
