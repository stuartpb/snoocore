---
title: Snoocore OAuth Script Authentication
layout: default
---

# Authenticating with Script OAuth

See an example [here](https://github.com/trevorsenior/snoocore-examples/blob/master/node/oauth-script.js).

Script based authentication is the easiest way to authenticate using OAuth with the Reddit API in Node.js

## Supported Apps

Explicit based OAuth will only work if you app is a `web` or `installed` application.


```javascript
var Snoocore = require('snoocore');

var reddit = new Snoocore({
	userAgent: 'test',
	login: { username: 'yourUsername', password: 'yourPassword' },
	oauth: { 
		type: 'script',
		consumerKey: 'client_id from reddit', 
		consumerSecret: 'client_secret from reddit',
		scope: [ 'flair', 'identity' ] // make sure to set all the scopes you need.
	}
});	 

// To authenticate with OAuth, simply call `auth()`
return reddit.auth().then(function() {
    // Make an OAuth call to show that it is working
    return reddit.api.v1.me.get();
})
.then(function(data) {
    console.log(data); // Log the response
});

```

The only caveat is that this method can only authenticate users listed as developers for the given application. Because of this, it makes it a great choice for bots.