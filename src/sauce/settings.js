"use strict";

// Sauce Settings
//
// Cobble together settings for sauce either from process.env or from a sauce configuration file

var argv = require("../margs").argv;

/*eslint-disable no-magic-numbers*/
var config = {
  // required:
  tunnelId: process.env.SAUCE_TUNNEL_ID,
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  sauceConnectVersion: process.env.SAUCE_CONNECT_VERSION,

  // optional:
  tunnelTimeout: process.env.SAUCE_TUNNEL_CLOSE_TIMEOUT,
  useTunnels: !!argv.create_tunnels,
  maxTunnels: argv.num_tunnels || 1,

  locksServerLocation: argv.locks_server || process.env.LOCKS_SERVER,
  locksOutageTimeout: 1000 * 60 * 5,
  locksPollingInterval: 2500,
  locksRequestTimeout: 2500
};


// Remove trailing / in locks server location if it's present.
if (typeof config.locksServerLocation === "string" && config.locksServerLocation.length > 0) {
  if (config.locksServerLocation.charAt(config.locksServerLocation.length - 1) === "/") {
    config.locksServerLocation = config.locksServerLocation.substr(0,
      config.locksServerLocation.length - 1);
  }
}

var parameterWarnings = {
  tunnelId: {
    required: config.useTunnels ? true : false,
    envKey: "SAUCE_TUNNEL_ID"
  },
  username: {
    required: true,
    envKey: "SAUCE_USERNAME"
  },
  accessKey: {
    required: true,
    envKey: "SAUCE_ACCESS_KEY"
  },
  sauceConnectVersion: {
    required: false,
    envKey: "SAUCE_CONNECT_VERSION"
  }
};

// Validate configuration if we have --sauce
if (argv.sauce) {
  var valid = true;
  Object.keys(parameterWarnings).forEach(function (key) {
    var param = parameterWarnings[key];

    if (!config[key]) {
      if (param.required) {
        console.log("Error! Sauce requires " + key + " to be set. Check if the environment"
          + " variable $" + param.envKey + " is defined.");
        valid = false;
      } else {
        console.log("Warning! No " + key + " is set. This is set via the environment variable $"
          + param.envKey + " . This isn't required, but can cause problems with Sauce if not set");
      }
    }
  });

  if (!valid) {
    process.exit(1);
  }
}

if (argv.debug) {
  console.log("Sauce configuration: ", config);
}

console.log("Sauce configuration OK");

module.exports = config;
