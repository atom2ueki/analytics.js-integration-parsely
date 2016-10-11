'use strict';

/**
 * Module dependencies.
 */

var integration = require('@segment/analytics.js-integration');
var defaults = require('@ndhoule/defaults');
var when = require('do-when');

/**
 * Expose `Parsely` integration.
 */

var Parsely = module.exports = integration('Parsely')
  .global('PARSELY')
  .global('parsely')
  .option('apiKey', '')
  .option('dynamicTracking', false)
  .option('trackEvents', false)
  .tag('<script src="//d1z2jf7jlzjs58.cloudfront.net/p.js">');

/**
 * Initialize.
 */

Parsely.prototype.initialize = function() {
  var self = this;
  window.parsely = window.parsely || { apikey: this.options.apiKey };

  // Set autoload to false to trigger pageviews on deliberate `page calls`
  if (this.options.dynamicTracking) {
    window.PARSELY = defaults(window.PARSELY = window.PARSELY || {}, {
      autotrack: false
    });
  }

  // append the meta tag we need first before JS fires
  var meta = document.createElement('meta');
  meta.id = 'parsely-cfg';
  meta.setAttribute('data-parsely-site', this.options.apiKey);
  var head = document.getElementsByTagName('head')[0];
  if (!head) return;
  head.appendChild(meta);

  this.load(function() {
    when(self.loaded, self.ready);
  });
};

Parsely.prototype.loaded = function() {
  return !!window.PARSELY;
};

/**
 * Page.
 *
 * Only Invoked if dynamicTracking is enabled (otherwise noop)
 */

Parsely.prototype.page = function(page) {
  if (this.options.dynamicTracking) {
    window.PARSELY.beacon.trackPageView({
      url: page.url(),
      urlref: page.referrer(),
      data: page.properties(),
      js: 1
    });
  }
};

/**
 * Track.
 *
 * http://www.parsely.com/help/integration/dynamic/
 */

Parsely.prototype.track = function(track) {
  if (this.options.trackEvents) {
    window.PARSELY.beacon.trackPageView({
      data: track.properties(),
      action: track.event(),
      url: track.proxy('context.page.url'),
      urlref: track.proxy('context.page.referrer'),
      js: 1
    });
  }
};