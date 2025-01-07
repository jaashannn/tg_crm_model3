(function () {
    const TRACKING_API_URL = "https://your-crm-domain.com/api/tracking/track"; // Replace with your API endpoint
  
    function sendTrackingData(data) {
      // Use Beacon API to send data without blocking the page load
      navigator.sendBeacon(TRACKING_API_URL, JSON.stringify(data));
    }
  
    function trackPageVisit() {
      const data = {
        page: window.location.pathname, // The current page path
        referrer: document.referrer, // The URL of the page that referred the user
        timestamp: new Date().toISOString(), // The time the page was visited
        userAgent: navigator.userAgent, // The browser's user agent string
      };
  
      // Send the tracking data
      sendTrackingData(data);
    }
  
    // Track the page visit when the page is fully loaded
    window.addEventListener("load", trackPageVisit);
  })();


  