// Load the http module to create an http server.
var fs = require('fs');
var http = require('http');
var url = require('url');

var history = [];

function calculate(arg1, arg2, op) {
	switch (op) {
		case "+": return arg1 + arg2;
		case "-": return arg1 - arg2;
		case "*": return arg1 * arg2;
		case "/": return arg1 / arg2;
	}
}

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
	var query = url.parse(request.url, true).query;
	
	var arg1 = parseInt(query.arg1);
	var arg2 = parseInt(query.arg2);
	var op = query.op;

	var result = calculate(arg1, arg2, op);

	fs.readFile("index.html", "utf8", function(err, contents) {
		if (!err) {
			if (result) {
				history.unshift(arg1 + " " + op + " " + arg2 + " = " + result);
				response.end(contents.replace("<p></p>", "<p>" + history.join("</p><p>") + "</p>"));
			} else {
				response.end(contents);
			}
		} else {
			console.log(err);
		}
	});
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");