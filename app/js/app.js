'use strict';

/**
 * Class for the main application.
 */
function App() {
  
  // Application's options
  this.options = {
    // Interval in milliseconds by which the calendar data is requested.
    interval: 300000, // 5 minutes,
    // Home location for the route calculation
    homeLocation: 'YOUR_HOME_LOCATION'
  };

  // Instance of the Calendar Handler
  this.calendarHandler = new CalendarHandler(this);

  // Instance of the Timer Handler
  this.timerHandler = new TimerHandler(this);

  /**
   * Main function to start the calendar monitor application.
   */
  this.startApp = function() {
    
    this.calendarHandler.loadCalendarApi();

    // Reload the application in a specified interval or on click events
    setInterval(this.reloadApp.bind(this), this.options.interval);
    document.getElementById('monitor').addEventListener('click', this.reloadApp.bind(this));

    // Reload the clock every second
    setInterval(this.displayClock, 1000);
  }

  /**
   * Reload the application.
   */
  this.reloadApp = function() {
    this.calendarHandler.listCalendarIds();
  }

  /**
   * Display the next event.
   * 
   * @param {Object} event Next event of all available calendars.
   */
  this.displayNextEvent = function(event) {
    // Display the event's title
    document.getElementById('event-title').innerHTML = event.summary;

    // Store the event's date and initialize the timer
    this.when = new Date(event.start.dateTime || event.start.date);

    // Display the event's location, if available
    if (event.location) {
      document.getElementById('event-location').innerHTML = event.location;

      // Geolocate the event's location
      let geocodingHandler = new GeocodingHandler(this);
      geocodingHandler.geocodeAddress(event.location);

      // Calculate the route to the event's location
      let directionsHandler = new DirectionsHandler(this);
      directionsHandler.calculateRoute(event.location);
    } else {
      this.displayTimer(this.when);
    }
  }

  this.displayRoute = function(duration) {
    document.getElementById('event-directions-title').innerHTML = 'Fahrtzeit: ';
    document.getElementById('event-directions-duration').innerHTML = duration.text;

    // Display the timer with respect to the estimated travel time
    let timeToGo = new Date(this.when.valueOf() - (duration.value * 1000));
    this.displayTimer(timeToGo);
  }

  /**
   * Display the timer.
   */
  this.displayTimer = function(timeToGo) {
    this.timerHandler.initTimer(timeToGo);

    this.timerHandler.animateTimer();
  }

  /**
   * Display a simple clock.
   */
  this.displayClock = function() {
    moment.locale('de');
    document.getElementById('clock').innerHTML = moment().format('LT');
  }

  /**
   * Start a screen saver when idle or next event in the far future.
   */
  this.screenSaver = function() {
    // TODO start when the next event is due in a long time or no activity has
    // been registered for a while
  }
}
