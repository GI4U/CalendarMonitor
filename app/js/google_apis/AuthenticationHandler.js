'use strict';

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  let authorizeDiv = document.getElementById('authorize-div');
  let monitor = document.getElementById('monitor');

  if (authResult && !authResult.error) {
    // Hide auth UI, start the main application
    authorizeDiv.style.display = 'none';
    monitor.style.display = 'inline';
    
    let app = new App();
    app.startApp();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
    monitor.style.display = 'none';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize({
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: false
  }, this.handleAuthResult);
}

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
}
