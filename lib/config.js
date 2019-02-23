const environments = {};

const UNIQUE_INPUTS = [
  "man",
  "help",
  "exit",
  "stats",
  "list users",
  "more user info",
  "list checks",
  "more check info",
  "list logs",
  "more log info"
];

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "thisIsASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
    fromPhone: "+5555555555"
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany, Inc",
    yearCreated: "2018",
    baseUrl: "http://localhost:3000/"
  },
  uniqueInputs: UNIQUE_INPUTS
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "thisIsAlsoASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
    fromPhone: "+5555555555"
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany, Inc",
    yearCreated: "2018",
    baseUrl: "http://localhost:5000/"
  },
  uniqueInputs: UNIQUE_INPUTS
};

environments.testing = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: "testing",
  hashingSecret: "thisIsASecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
    fromPhone: "+5555555555"
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany, Inc",
    yearCreated: "2018",
    baseUrl: "http://localhost:3000/"
  },
  uniqueInputs: UNIQUE_INPUTS
};

const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

const environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
