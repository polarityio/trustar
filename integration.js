"use strict";

const request = require("request");
const _ = require("lodash");
const config = require("./config/config");
const async = require("async");
const fs = require("fs");

let Logger;
let requestWithDefaults;

const MAX_PARALLEL_LOOKUPS = 10;

const NodeCache = require("node-cache");
const tokenCache = new NodeCache({
  stdTTL: 1000 * 1000
});

/**
 *
 * @param entities
 * @param options
 * @param cb
 */
function startup(logger) {
  let defaults = {};
  Logger = logger;

  if (
    typeof config.request.cert === "string" &&
    config.request.cert.length > 0
  ) {
    defaults.cert = fs.readFileSync(config.request.cert);
  }

  if (typeof config.request.key === "string" && config.request.key.length > 0) {
    defaults.key = fs.readFileSync(config.request.key);
  }

  if (
    typeof config.request.passphrase === "string" &&
    config.request.passphrase.length > 0
  ) {
    defaults.passphrase = config.request.passphrase;
  }

  if (typeof config.request.ca === "string" && config.request.ca.length > 0) {
    defaults.ca = fs.readFileSync(config.request.ca);
  }

  if (
    typeof config.request.proxy === "string" &&
    config.request.proxy.length > 0
  ) {
    defaults.proxy = config.request.proxy;
  }

  if (typeof config.request.rejectUnauthorized === "boolean") {
    defaults.rejectUnauthorized = config.request.rejectUnauthorized;
  }

  requestWithDefaults = request.defaults(defaults);
}

function getTokenCacheKey(options) {
  return options.apiKey + options.apiSecret;
}

function getAuthToken(options, callback) {
  let cacheKey = getTokenCacheKey(options);
  //let token = tokenCache.get(cacheKey);

  request(
    {
      method: "POST",
      uri: `${options.url}/oauth/token`,
      auth: {
        user: options.apiKey,
        pass: options.apiSecret
      },
      headers: {
        "Client-Type": "API"
      },
      form: {
        grant_type: "client_credentials"
      },
      json: true
    },
    (err, resp, body) => {
      if (err) {
        callback(err);
        return;
      }

      Logger.trace({ body: body }, "Result of token lookup");

      if (resp.statusCode != 200) {
        callback({ err: new Error("status code was not 200"), body: body });
        return;
      }

      tokenCache.set(cacheKey, body.access_token);

      Logger.trace({ tokenCache: tokenCache }, "Checking TokenCache");

      callback(null, body.access_token);
    }
  );
}

function doLookup(entities, options, cb) {
  let lookupResults = [];
  let tasks = [];

  Logger.debug(entities);

  getAuthToken(options, (err, token) => {
    if (err) {
      Logger.error("get token errored", err);
      //callback({ err: err });
      return;
    }

    Logger.trace({ token: token }, "what does the token look like in doLookup");

    entities.forEach(entity => {
      //do the lookup
      let postData = [{ value: entity.value.toLowerCase() }];
      let requestOptions = {
        method: "POST",
        uri: `${options.url}/api/1.3/indicators/metadata`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
          //'Client-Type': 'API'
        },
        body: postData,
        json: true
      };

      Logger.trace({ uri: requestOptions }, "Request URI");
      //Logger.trace({ uri: requestOptions.headers }, "Request Headers");
      //Logger.trace({ uri: requestOptions.qs }, "Request Query Parameters");

      tasks.push(function(done) {
        requestWithDefaults(requestOptions, function(error, res, body) {
          if (error) {
            return done(error);
          }

          Logger.trace(requestOptions);
          Logger.trace(
            { body: body, statusCode: res ? res.statusCode : "N/A" },
            "Result of Lookup"
          );

          let result = {};

          if (res.statusCode === 200) {
            // we got data!
            result = {
              entity: entity,
              body: body
            };
          } else if (res.statusCode === 404) {
            // no result found
            result = {
              entity: entity,
              body: null
            };
          } else if (res.statusCode === 202) {
            // no result found
            result = {
              entity: entity,
              body: null
            };
          } else {
            // unexpected status code
            return done({
              err: body,
              detail: `${body.error}: ${body.message}`
            });
          }

          done(null, result);
        });
      });
    });

    async.parallelLimit(tasks, MAX_PARALLEL_LOOKUPS, (err, results) => {
      if (err) {
        Logger.error({ err: err }, "Error");
        cb(err);
        return;
      }

      results.forEach(result => {
        if (result.body === null || _isMiss(result.body) || _.isEmpty(result.body)) {
          lookupResults.push({
            entity: result.entity,
            data: null
          });
        } else {
          lookupResults.push({
            entity: result.entity,
            data: {
              summary: [],
              details: result.body[0]
            }
          });
        }
      });

      Logger.debug({ lookupResults }, "Results");
      cb(null, lookupResults);
    });
  });
}

function _isMiss(body) {
  if (!body) {
    return true;
  }
}

function validateStringOption(errors, options, optionName, errMessage) {
  if (
    typeof options[optionName].value !== "string" ||
    (typeof options[optionName].value === "string" &&
      options[optionName].value.length === 0)
  ) {
    errors.push({
      key: optionName,
      message: errMessage
    });
  }
}

function validateOptions(options, callback) {
  let errors = [];

  validateStringOption(
    errors,
    options,
    "apiKey",
    "You must provide a valid API Key"
  );
  validateStringOption(
    errors,
    options,
    "apiSecret",
    "You must provide a valid API Secret"
  );
  callback(null, errors);
}

module.exports = {
  doLookup: doLookup,
  startup: startup,
  validateOptions: validateOptions
};
