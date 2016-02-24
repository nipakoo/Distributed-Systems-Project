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

app.all('/', function(request, response, next) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get("/", function(request, response) {
	var query = url.parse(request.url, true).query;
	
	var arg1 = parseFloat(query.arg1);
	var arg2 = parseFloat(query.arg2);
	var op = query.op;

	var result = calculate(arg1, arg2, op);

	response.json({result: result});
});

app.listen(8000, function () {
  	console.log("Server running at http://127.0.0.1:8000/");
});