'use strict';

/**
 * Class to handle the Google Directions API requests.
 * 
 * @param {Object} app Instance of the main application.
 */
function DirectionsHandler(app) {

  // Instance of the main application
  this.app = app;

  /**
   * Calculate the route to the destination.
   * 
   * @param {Object} destination Destination for the route.
   */
  this.calculateRoute = function(destination) {
    // Load the Google Directions service
    let directionsService = new google.maps.DirectionsService;

    // Calculate the route
    directionsService.route({
      origin: this.app.options.homeLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.BICYCLING // TODO set travel mode dynamically
    }, (res, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        let duration = res.routes[0].legs[0].duration;
        if (duration) {
          this.app.displayRoute(duration);
        }
      }
    });
  }
}
