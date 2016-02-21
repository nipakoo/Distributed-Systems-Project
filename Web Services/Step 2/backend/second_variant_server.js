// Load the http module to create an http server.
var express = require('express');
var fs = require('fs');
var gnuplot = require('gnuplot');
var url = require('url');

var app = express();

function calculate(arg1, arg2, op) {
	switch (op) {
		case "+": return arg1 + arg2;
		case "-": return arg1 - arg2;
		case "*": return arg1 * arg2;
		case "/": return arg1 / arg2;
	}
}

app.get("/calculate", function(request, response) {
	var query = url.parse(request.url, true).query;
	
	var arg1 = parseInt(query.arg1);
	var arg2 = parseInt(query.arg2);
	var op = query.op;

	var result = calculate(arg1, arg2, op);
	
	var response_string = query.arg1 + " " + query.op + " " + query.arg2 + " = " + result;

	response.jsonp({line: response_string});
});

app.listen(8000, function () {
  	console.log("Server running at http://127.0.0.1:8000/");
});