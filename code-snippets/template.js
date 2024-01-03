// paste this into the chrome console of any site to intercept network responses

// override XMLHttpRequest (older sites)
(function () {
  const RESPONSE_FILTER = `_________________`;
  const WEBHOOK_URL = `_________________`;

  const forwardNetworkData = async (payload) => {
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  var originalOpen = XMLHttpRequest.prototype.open;
  var oldXHRSend = XMLHttpRequest.prototype.send;

  // Override the open method
  XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
    this._method = method; // Store the method so it can be accessed later
    this._url = url; // Store the URL so it can be accessed later

    // Call the original open method with the original context and arguments
    originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener("load", function () {
      if (this.responseText.includes(RESPONSE_FILTER)) {
        console.log(`Request ${this._method} to ${this._url}`);
        // console.log("Response from: " + this.responseURL);
        // console.log("Response text: " + this.responseText);
        // console.log("Response raw: " + this.response);
        forwardNetworkData({
          url: window.location.href,
          data: this.responseText,
        });
      }
    });

    // Continue with the original send function
    oldXHRSend.apply(this, arguments);
  };
})();

// override fetch (newer sites)
(function () {
  const RESPONSE_FILTER = `_________________`;
  const WEBHOOK_URL = `_________________`;

  const forwardNetworkData = async (payload) => {
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  var originalFetch = fetch;
  window.fetch = function () {
    // Call the original fetch function
    return originalFetch.apply(this, arguments).then((response) => {
      // Clone the response so you don't modify the original response
      var clone = response.clone();

      // Log the URL and status
      console.log("Fetch response from: " + response.url);
      console.log("Status: " + response.status);

      // Handle the response data
      clone.text().then((text) => {
        if (response.url.includes(RESPONSE_FILTER)) {
          console.log("Fetch response data: " + text);
          // Do whatever you want with the text
          forwardNetworkData({
            url: window.location.href,
            data: text,
            responseUrl: response.url,
          });
        }
      });

      // Make sure to return the original response for fetch
      return response;
    });
  };
})();
