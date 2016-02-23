var calculation;

var cache_size = 0;

var cache = [];

function set_cache_size() {
	cache_size = parseInt($("#cache_size").val());
	if (cache_size < cache.length) {
		cache = cache.slice(0, cache_size);
	}
}

function cache_calculation(next_calculation, result) {
	for (var i = 0; i < cache.length; i++) {
		if (cache[i].calculation == next_calculation) {
			cache.splice(i, 1);
		}
	}

	cache.unshift({calculation: next_calculation, result: result});

	if (cache.length > cache_size) {
		cache.pop();
	}

	for (var i = 0; i < cache.length; i++) {
		console.log(JSON.stringify(cache[i]));
	}
}

function check_cache(next_calculation) {
	var result;

	for (var i = 0; i < cache.length; i++) {
		if (cache[i].calculation == next_calculation) {
			result = cache[i].result;
		}
	}

	return result;
}

function handle_calculation_response(data) {
	var line = data.line;
	$("body").append("<p>" + line + "</p>");

	cache_calculation($("#calculation").val(), line);

	if (calculation.length > 0) {
		line_array = line.split(" ");
		send_calculation(line_array[line_array.length-1], calculation.shift(), calculation.shift());
	}
}

function draw(data) {
	cache_calculation($("#sine").val(), data.response_array);

	var canvas = document.createElement('canvas');
	$(canvas).width(640).height(480);

	var axes={}, ctx=canvas.getContext("2d");
	axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
	axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	axes.doNegativeX = true;

	showAxes(ctx,axes);
	drawGraph(ctx,axes,"rgb(11,153,11)",1, data.response_array.split(','));

	$("body").append(canvas);
}

function drawGraph (ctx,axes,color,thick,data) {
	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	var i = 0;
	for (var x = -3.2; x < 3.2; x+=0.1) {
		if (x==-3.2) {
			ctx.moveTo(axes.x0+axes.scale*x,axes.y0+axes.scale*data[i]);
		} else {
			ctx.lineTo(axes.x0+axes.scale*x,axes.y0+axes.scale*data[i]);
		}
		i++;
	}
	ctx.stroke();
}

function showAxes(ctx,axes) {
	var x0=axes.x0, w=ctx.canvas.width;
	var y0=axes.y0, h=ctx.canvas.height;
	var xmin = 0;
	ctx.beginPath();
	ctx.strokeStyle = "rgb(128,128,128)"; 
	ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
	ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
	ctx.stroke();
}

function send_calculation(arg1, op, arg2) {
	cached_result = check_cache(arg1 + " " + op + " " + arg2);
	if (cached_result === undefined) {
		$.ajax("http://127.0.0.1:8000/calculate", {
			type: "GET",
			data: {
				"arg1": arg1,
				"arg2": arg2,
				"op": op
			},
	    	crossDomain: true,
	    	dataType: "jsonp",
			success: handle_calculation_response
		});
	} else {
		handle_calculation_response({line: cached_result});
	}
}

function send_sine(functions) {
	$.ajax("http://127.0.0.1:8000/sine", {
		type: "GET",
		data: {
			"functions": functions
		},
    	crossDomain: true,
    	dataType: "jsonp",
		success: draw
	});
}

function calculation_click() {
	calculation = $("#calculation").val().split(" ");

	send_calculation(calculation.shift(), calculation.shift(), calculation.shift());
}

function sine_click() {
	var sine = $("#sine").val();

	cached_result = check_cache(sine);
	if (cached_result === undefined) {
		send_sine(sine);
	} else {
		draw({response_array: cached_result});
	}
}

function simplify() {
	for (var i = 3; i < calculation.length()+1; i++) {
		var partial_calculation = calculation.slice(0, i);

		var check_calculation
	}

	$("#calculation").val(calculation.join(" "));
}

function simplify_click() {
	var calculation = $("#calculation").val().split(" ");
	simplify();
}

$(document).ready(function () {
    $('#calculation_button').click(calculation_click);
    $('#sine_button').click(sine_click);
    $('#cache_size_button').click(set_cache_size);
    $('#simplify_button').click(simplify_click);
});