'use strict';

/**
 * Class to handle the timer visualisation.
 * 
 * @param {Object} app Instance of the main application.
 */
function TimerHandler(app) {

  // Instance of the main application
  this.app = app;

  // Instance of the Progress Bar
  this.bar = null;

  // Date when the event will take place or it is time to depart
  this.timeToGo = null;

  /**
   * Initilization of the timer for the next event.
   * 
   * @param {Date} timeToGo Date when the event will take place or it is time
   * to depart.
   */
  this.initTimer = function(timeToGo) {
    this.timeToGo = timeToGo;

    let container = document.getElementById('event-timer');
    container.innerHTML = '';

    this.bar = new ProgressBar.Circle(container, {
      color: '#FFF',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 8,
      trailWidth: 4,
      duration: this.calculateTimeDiff(this.timeToGo),
      from: {
        color: '#2c2',
        width: 4
      },
      to: {
        color: '#c22',
        width: 8
      },
      step: (state, circle) => {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        if (this.timeToGo > new Date()) {
          moment.locale('de');
          circle.setText(moment(this.timeToGo).fromNow());
        } else {
          circle.setText('Time to go!');
        }

      }
    });
    
    this.bar.text.className = 'event-timer-text';
  }

  /**
   * Check whether the timer shall start the animation.
   */
  this.animateTimer = function() {
    // Only animate the timer for events in the next hour
    if (this.calculateTimeDiff(this.timeToGo) < 3600000) {
      this.bar.animate(1.0);
    } else {
      // Check in 10 minutes again whether the animation shall start
      setTimeout(this.animateTimer.bind(this), 600000);
    }
  }

  /**
   * Calculates the remaining time until the event will take place.
   * 
   * @return {Number} Remaining time. Will return `-1` when the time to go has
   * not been set.
   */
  this.calculateTimeDiff = function() {
    if (this.timeToGo) {
      return this.timeToGo - new Date();
    } else {
      return -1;
    }
  }
}
