'use strict';

/**
 * Class to handle the Google Calendar API requests.
 * 
 * @param {Object} app Instance of the main application.
 */
function CalendarHandler(app) {

  // Instance of the main application
  this.app = app;

  // Last event
  this.lastEvent = null;

  /**
   * Load Google Calendar client library. Request the calendar data in intervals
   * once client library is loaded.
   */
  this.loadCalendarApi = function() {
    gapi.client.load('calendar', 'v3', this.listCalendarIds.bind(this));
  }

  /**
   * List all available calendar IDs which are owned.
   */
  this.listCalendarIds = function() {
    let request = gapi.client.calendar.calendarList.list();

    request.execute((res) => {
      let calendarIds = [];

      res.items.forEach((item) => {

        if (item.accessRole && item.accessRole === 'owner') {
          calendarIds.push(item.id);
        }

      });

      if (calendarIds.length > 0) {
        this.getNextEvents(calendarIds);
      }
    });
  }

  /**
   * Get the next event of each calendar.
   * 
   * @param {Array} calendarIds IDs of the available calendars.
   */
  this.getNextEvents = function(calendarIds) {
    let events = [];
    let total = calendarIds.length;

    calendarIds.forEach((calendarId) => {

      let request = gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      });

      request.execute((res) => {
        
        let event;
        if (res.items.length > 0) {
          // Filter out the events with a start date in the past
          for (let i = 0; i < res.items.length; i++) {
            let startDate = res.items[i].start.dateTime || res.items[i].start.date;
            startDate = new Date(startDate);

            if (startDate > new Date()) {
              event = res.items[i];
              break;
            }
          }
        }

        if (event) {
          events.push(event);
        } else {
          total--;
        }

        if (events.length == total) {
          this.findNextEvent(events);
        }

      });

    });
  }

  /**
   * Find the next event from all available calendars.
   * 
   * @param {Array} events Next events from all available calendars.
   */
  this.findNextEvent = function(events) {
    let min = null;
    let candidate = null;

    events.forEach((event) => {
      
      let when = event.start.dateTime || event.start.date;
      when = new Date(when);

      if (!min || (when < min)) {
        min = when;
        candidate = event;
      }

    });

    if (candidate && !this.compareEvents(candidate, this.lastEvent)) {
      this.lastEvent = candidate;
      this.app.displayNextEvent(candidate);
    }
  }

  /**
   * Compare two events with each other.
   * 
   * @param  {Object} e1 First event to be compared.
   * @param  {Object} e2 Second event to be compared.
   * 
   * @return {Boolean} Indicates equality.
   */
  this.compareEvents = function(e1, e2) {
    if (e1 && e2) {
      let startDate1 = e1.start.dateTime || e1.start.date;
      let startDate2 = e2.start.dateTime || e2.start.date;

      let location1 = e1.location;
      let location2 = e2.location;

      if ((startDate1 === startDate2) && (location1 === location2)) {
        return true;
      }
    }
    
    return false;
  }
}
