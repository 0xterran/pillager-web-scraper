// paste this into the chrome console of any site to intercept network responses
// Visit: https://pro.similarweb.com/#/digitalsuite/websiteanalysis/overview/website-performance/*/999/3m?webSource=Total&key=sproutsocial.com
// replace key= in url with the key of the site you want to scrape
// more details at https://pillager.app

// override fetch (newer sites)
(function () {
  window.scraping_history = [];
  const webhookURL = "https://_____________.m.pipedream.net";

  let fullObject = {
    EngagementVisits: null,
    TrafficSourcesSocial: null,
    TopReferrals: null,
    TopAdNetworks: null,
    NewSearchKeywordsWorldWide: null,
    TrafficSourcesOverview: null,
    WebsiteGeography: null,
    EngagementOverview: null,
    WebsiteOverview: null,
    getsimilarsites: null,
    TopIncomingAds: null,
    TrafficDestinationAds: null,
    TrafficDestinationReferrals: null,
  };

  const forwardNetworkData = async (payload) => {
    fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  function areAllFieldsNonNull(obj) {
    for (const value of Object.values(obj)) {
      if (value === null) {
        return false;
      }
    }
    return true;
  }

  function setAllFieldsToNull(obj) {
    const keys = Object.keys(obj);
    for (const key of keys) {
      obj[key] = null;
    }
    return obj;
  }

  var originalFetch = fetch;
  window.fetch = function () {
    // Call the original fetch function
    return originalFetch.apply(this, arguments).then((response) => {
      // Clone the response so you don't modify the original response
      var clone = response.clone();

      // Log the URL and status
      // console.log("Fetch response from: " + response.url);
      // console.log("Status: " + response.status);

      // Handle the response data
      clone.text().then((text) => {
        if (
          response.url.includes(
            `/widgetApi/WebsiteOverview/EngagementVisits/Table`
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.EngagementVisits = text;
        }
        if (
          response.url.includes(
            "/widgetApi/WebsiteOverviewDesktop/TrafficSourcesSocial/PieChart"
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.TrafficSourcesSocial = text;
        }
        if (
          response.url.includes(
            "/widgetApi/WebsiteOverviewDesktop/TopReferrals/Table"
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.TopReferrals = text;
        }
        if (
          response.url.includes(
            "/widgetApi/WebsiteOverviewDesktop/TopAdNetworks/PieChart"
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.TopAdNetworks = text;
        }
        if (
          response.url.includes(
            "/widgetApi/SearchKeywords/NewSearchKeywordsWorldWide/WebsitePerformance/Table"
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.NewSearchKeywordsWorldWide = text;
        }
        if (
          response.url.includes(
            "/widgetApi/MarketingMixTotal/TrafficSourcesOverview/PieChart"
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.TrafficSourcesOverview = text;
        }
        if (
          response.url.includes("/widgetApi/WebsiteGeography/Geography/Table")
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.WebsiteGeography = text;
        }
        if (
          response.url.includes(
            "/widgetApi/WebsiteOverview/EngagementOverview/Table"
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.EngagementOverview = text;
        }
        if (response.url.includes("/api/WebsiteOverview/getheader")) {
          // console.log("Fetch response data: " + text);
          fullObject.WebsiteOverview = text;
        }
        if (response.url.includes("/api/WebsiteOverview/getsimilarsites")) {
          // console.log("Fetch response data: " + text);
          fullObject.getsimilarsites = text;
        }
        if (
          response.url.includes(
            "/widgetApi/WebsiteOverviewDesktop/TopIncomingAds/Table"
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.TopIncomingAds = text;
        }
        if (
          response.url.includes(
            "/widgetApi/WebsiteOverviewDesktop/TrafficDestinationAds/Table"
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.TrafficDestinationAds = text;
        }
        if (
          response.url.includes(
            "/widgetApi/WebsiteOverviewDesktop/TrafficDestinationReferrals/Table"
          )
        ) {
          // console.log("Fetch response data: " + text);
          fullObject.TrafficDestinationReferrals = text;
        }

        if (areAllFieldsNonNull(fullObject)) {
          let key = window.location.href.split("key=")[1];
          console.log(`Saving key: ${key}`);
          if (window.scraping_history.includes(key) === false) {
            // Now you can do whatever you want with the text!
            forwardNetworkData({
              url: window.location.href,
              data: fullObject,
            });
            window.scraping_history.push(key);
            setTimeout(() => {
              fullObject = setAllFieldsToNull(fullObject);
            }, 500);
          }
        }
      });

      // Make sure to return the original response
      return response;
    });
  };
})();
