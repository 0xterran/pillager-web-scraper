// paste this into the chrome console of the reddit search results to intercept network responses
// more details at https://pillager.app

(function () {
  const webhookURL = "https://_____________.m.pipedream.net";

  const forwardNetworkData = async (payload) => {
    fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  const RESPONSE_FILTER = `{"data":{"search":{"general":{"posts":{"feedMetadata":`;

  var oldXHRSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    this.addEventListener("load", function () {
      if (this.responseText.includes(RESPONSE_FILTER)) {
        console.log("Response from: " + this.responseURL);
        console.log("Response: " + this.responseText);
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
