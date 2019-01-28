var app = {};

app.config = {
  sessionToken: false
};

app.client = {};

app.client.request = (
  headers,
  path,
  method,
  queryStringObject,
  payload,
  cb
) => {
  headers = typeof headers == "object" && headers !== null ? headers : {};
  path = typeof path == "string" ? path : "/";
  method =
    typeof method == "string" &&
    ["POST", "GET", "PUT", "DELETE"].includes(method.toUpperCase())
      ? method.toUpperCase()
      : "GET";
  queryStringObject =
    typeof queryStringObject == "object" && queryStringObject !== null
      ? queryStringObject
      : {};
  payload = typeof payload == "object" && payload !== null ? payload : {};
  cb = typeof cb == "function" ? cb : false;

  let requestUrl = `${path}?`;
  let counter = 0;

  for (let queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      counter++;

      if (counter > 1) {
        requestUrl += "&";
      }

      requestUrl = `${requestUrl}${queryKey}=${queryStringObject[queryKey]}`;
    }
  }

  const xhr = new XMLHttpRequest();

  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  for (let headerKey in headers) {
    if (headers.hasOwnProperty(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    }
  }

  if (app.config.sessionToken) {
    xhr.setRequestHeader("token", app.config.sessionToken.id);
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const { status: statusCode, responseText: responseReturned } = xhr;

      if (cb) {
        try {
          const parsedResponse = JSON.parse(responseReturned);

          cb(statusCode, parsedResponse);
        } catch (error) {
          cb(statusCode, false);
        }
      }
    }
  };

  const payloadString = JSON.stringify(payload);

  xhr.send(payloadString);
};
