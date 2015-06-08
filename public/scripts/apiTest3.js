var request = require('request');
request('http://www.colourlovers.com/api/palettes/top', function(error, response, body) {
	console.log(body);
});




$.ajax({
	type: "GET",
	url: "http://www.colourlovers.com/api/patterns/top?format=json",
	contentType: "application/json",
	dataType: "json",
	success: function(data) {
		console.log(data);

	}
});