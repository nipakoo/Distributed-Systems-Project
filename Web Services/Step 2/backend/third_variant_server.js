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

function calculate_sin(x) {
	var sin = x -
		(Math.pow(x, 3) / (3 * 2)) +
		(Math.pow(x, 5) / (5 * 4 * 3 * 2)) -
		(Math.pow(x, 7) / (7 * 6 * 5 * 4 * 3 * 2)) +
		(Math.pow(x, 9) / (9 * 8 * 7 * 6 * 5 * 4 * 3 * 2));

	return sin;
}

function calculate_cos(x) {
	var cos = 1 -
		(Math.pow(x, 2) / (2)) +
		(Math.pow(x, 4) / (4 * 3 * 2)) -
		(Math.pow(x, 6) / (6 * 5 * 4 * 3 * 2)) +
		(Math.pow(x, 8) / (8 * 7 * 6 * 5 * 4 * 3 * 2));

	return cos;
}

function calculate_tan(x) {
	return calculate_sin(x) / calculate_cos(x);
}

function create_plot_array(func) {
	var ys = [];
	for (var x = -3.2; x < 3.2; x+=0.1) {
		switch (func) {
			case "sin(x)": ys[ys.length] = calculate_sin(x);
			case "cos(x)": ys[ys.length] = calculate_cos(x);
			case "tan(x)": ys[ys.length] = calculate_tan(x);
		}
	}
	return ys;
}

app.get("/sine", function(request, response) {
	var func = url.parse(request.url, true).query.functions;

	plot_array_string = create_plot_array(func).toString();
	response.jsonp({response_array: plot_array_string});
});

app.listen(8000, function () {
  	console.log("Server running at http://127.0.0.1:8000/");
});