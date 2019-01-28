const crypto = require("crypto");
const config = require("./config");
const https = require("https");
const querystring = require("querystring");
const path = require("path");
const fs = require("fs");

const helpers = {};

helpers.hash = str => {
  if (typeof str == "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};

helpers.parseJsonToObject = str => {
  try {
    const obj = JSON.parse(str);

    return obj;
  } catch (error) {
    return {};
  }
};

helpers.createRandomString = strLength => {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 1; i <= strLength; i++) {
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      str = str.concat(randomCharacter);
    }

    return str;
  } else {
    return false;
  }
};

helpers.sendTwilioSms = (phone, msg, cb) => {
  phone =
    typeof phone == "string" && phone.trim().length === 10
      ? phone.trim()
      : false;
  msg =
    typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (phone && msg) {
    const payload = {
      From: config.twilio.fromPhone,
      To: `+1${phone}`,
      Body: msg
    };
    const stringPayload = querystring.stringify(payload);
    const requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages`,
      auth: `${config.twilio.accountSid}:${config.twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload)
      }
    };

    const req = https.request(requestDetails, res => {
      const status = res.statusCode;

      if (status == 200 || status == 201) {
        cb(false);
      } else {
        cb(`Status code returned was ${status}`);
      }
    });

    req.on("error", err => {
      cb(err);
    });

    req.write(stringPayload);

    req.end();
  } else {
    cb("Given parameters were missing or invalid");
  }
};

helpers.getTemplate = (templateName, data, cb) => {
  templateName =
    typeof templateName == "string" && templateName.length
      ? templateName
      : false;

  data = typeof data == "object" && data != null ? data : {};

  if (templateName) {
    const templatesDir = path.join(__dirname, "/../templates/");

    fs.readFile(`${templatesDir}${templateName}.html`, "utf8", (err, str) => {
      if (!err && str && str.length) {
        const finalString = helpers.interpolate(str, data);

        cb(false, finalString);
      } else {
        cb("No template could be found");
      }
    });
  } else {
    cb("A valid template name was not specified");
  }
};

helpers.addUniversalTemplates = (str, data, cb) => {
  str = typeof str == "string" && str.length ? str : "";
  data = typeof data == "object" && data != null ? data : {};

  helpers.getTemplate("_header", data, (err, headerString) => {
    if (!err && headerString) {
      helpers.getTemplate("_footer", data, (err, footerString) => {
        if (!err && footerString) {
          const fullString = `${headerString}${str}${footerString}`;

          cb(false, fullString);
        } else {
          cb("Could not find the footer template");
        }
      });
    } else {
      cb("Could not find the header template");
    }
  });
};

helpers.interpolate = (str, data) => {
  str = typeof str == "string" && str.length ? str : "";
  data = typeof data == "object" && data != null ? data : {};

  for (let keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data[`global.${keyName}`] = config.templateGlobals[keyName];
    }
  }

  for (let key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] == "string") {
      const replace = data[key];
      const find = `{${key}}`;

      str = str.replace(find, replace);
    }
  }

  return str;
};

helpers.getStaticAsset = (fileName, cb) => {
  fileName = typeof fileName == "string" && fileName.length ? fileName : false;

  if (fileName) {
    const publicDir = path.join(__dirname, "/../public/");

    fs.readFile(`${publicDir}${fileName}`, (err, assetFiles) => {
      if (!err && assetFiles) {
        cb(false, assetFiles);
      } else {
        cb("No file could be found");
      }
    });
  } else {
    cb("A valid file name was not specified");
  }
};

module.exports = helpers;
