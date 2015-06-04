var request = require('request');
request('http://www.colourlovers.com/api/palettes/top', function(error, response, body) {
  console.log(body);
});