"use strict";

// Node.js libraries
import events from 'events';
import util from 'util';

// Our modules
import Request from './Request';
import RedditRequest from './RedditRequest';
import Throttle from './Throttle';
import UserConfig from './UserConfig';
import OAuth from './OAuth';

Snoocore.file = require('./https/file');
Snoocore.version = '3.0.0';

module.exports = Snoocore;
util.inherits(Snoocore, events.EventEmitter);
function Snoocore(userConfiguration) {

  var self = this;

  events.EventEmitter.call(self);

  // @TODO - this is a "god object" of sorts.
  self._userConfig = new UserConfig(userConfiguration);

  self._throttle = new Throttle(self._userConfig.throttle);

  self._request = new Request(self._throttle);

  // Two OAuth instances. One for authenticated users, and another for
  // Application only OAuth. Two are needed in the instance where
  // a user wants to bypass authentication for a call - we don't want
  // to waste time by creating a new app only instance, authenticating,
  // etc.
  self.oauth = new OAuth(self._userConfig, self._request);
  self.oauthAppOnly = new OAuth(self._userConfig, self._request);

  // Expose OAuth functions in here
  self.getExplicitAuthUrl = self.oauth.getExplicitAuthUrl.bind(self.oauth);
  self.getImplicitAuthUrl = self.oauth.getImplicitAuthUrl.bind(self.oauth);
  self.auth = self.oauth.auth.bind(self.oauth);
  self.refresh = self.oauth.refresh.bind(self.oauth);
  self.deauth = self.oauth.deauth.bind(self.oauth);

  self._redditRequest = new RedditRequest(self._userConfig,
                                          self._request,
                                          self.oauth,
                                          self.oauthAppOnly);

  // bubble up the events
  self._redditRequest.on('server_error', function(responseError) {
    self.emit('server_error', responseError);
  });

  self._redditRequest.on('access_token_expired', function(responseError) {
    self.emit('access_token_expired', responseError);
  });

  /*
     Make self._redditRequest.path the primary function that we return, but
     still allow access to the objects defined on self
   */
  var key;
  for (key in self) {
    self._redditRequest.path[key] = self[key];
  }

  self = self._redditRequest.path;
  return self;
}
