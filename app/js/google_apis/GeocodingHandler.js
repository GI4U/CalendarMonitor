'use strict';

/**
 * Class to handle geocoding requests.
 *
 * @param {Object} app Instance of the main application.
 */
function GeocodingHandler(app) {
  
  // Instance of the main application
  this.app = app;

  // Instance of the Google Maps Geocoder
  this.geocoder = new google.maps.Geocoder();

  /**
   * Geocode an address to coordinates.
   * 
   * @param {String} address Location as a physical address.
   * 
   * @return {Object} Coordinates of the address as an object.
   */
  this.geocodeAddress = function(address) {
    this.geocoder.geocode({'address': address}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        let location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };

        // TODO this.app.displayTimer(location);
      } else {

        // TODO this.app.displayTimer(null);
      }
    });
  }
}
