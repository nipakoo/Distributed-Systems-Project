var result;

var cache_size = 0;

var cache = [];

// CACHING FUNCTIONS TODO: CHECK THEM

function set_cache_size() {
	cache_size = parseInt($("#cache_size").val());
	if (cache_size < cache.length) {
		cache = cache.slice(0, cache_size);
	}
}

function cache_calculation(calculation, result) {
	for (var i = 0; i < cache.length; i++) {
		if (cache[i].calculation == calculation) {
			cache.splice(i, 1);
		}
	}

	cache.unshift({calculation: calculation, result: result});

	if (cache.length > cache_size) {
		cache.pop();
	}
}

function check_cache(calculation) {
	for (var i = 0; i < cache.length; i++) {
		if (cache[i].calculation == calculation) {
			return cache[i].result;
		}
	}
}


// SIMPLIFY FUNTIONS


function simplify_click() {
	var calculation = $("#calculation").val().split(" ");

	cached_result = check_cache(calculation[0] + " " + calculation[1] + " " + calculation[2]);

	if (cached_result !== undefined) {
		calculation_tail = calculation.slice(3, calculation.length);
		if (calculation_tail !== undefined) {
			calculation_tail.unshift(cached_result);
			$("#calculation").val(calculation_tail.join(" "));
		} else {
			$("#calculation").val(cached_result);
		}
	}
}


// CALCULATION FUNCTIONS


function calculate(arg1, op, arg2) {
	var calculation = arg1 + " " + op + " " + arg2;
	var cached_result = check_cache(calculation);

	if (cached_result !== undefined) {
		result = cached_result;
	} else {
		$.ajax("http://127.0.0.1:8000/", {
			type: "GET",
			async: false,
			data: {
				"arg1": arg1,
				"op": op,
				"arg2": arg2
			},
			success: function(data) {
				result = "" + data.result;
			}
		});
	}

	cache_calculation(calculation, result);
}

function process_calculations(calculations) {
 	var arg1 = ""+calculations[0];
	for (var i = 1; i < calculations.length-1; i+=2) {
		var op = calculations[i];
		var arg2 = ""+calculations[i+1];

		calculate(arg1, op, arg2);

		arg1 = result;
	}
	return result;
}

function calculation_click() {
	calculations = $("#calculation").val().split(" ");
	process_calculations(calculations);
	$("#result").text(calculations.join(" ") + " = " + result);
}

function sine_click() {
	func = $("#sine").val();
	draw(func);
}

$(document).ready(function () {
    $('#calculation_button').click(calculation_click);
    $('#sine_button').click(sine_click);
    $('#cache_size_button').click(set_cache_size);
    $('#simplify_button').click(simplify_click);
});


// FUNCTIONS FOR PLOTTING


function calculate_sin(x) {
	var sin = x;
	var numerator = process_calculations([x,"*",x,"*",x]);
	var denominator = process_calculations([3,"*",2]);

	for (var i = 4; i < 11; i+=2) {
		var next = process_calculations([numerator,"/",denominator]);

		if (i % 4 === 0) {
			sin = process_calculations([sin,"-",next]);
		} else {
			sin = process_calculations([sin,"+",next]);
		}

		numerator = process_calculations([x,"*",x,"*",numerator]);
		denominator = process_calculations([i+1,"*",i,"*",denominator]);
	}

	console.log(sin);

	return sin;
}

function calculate_cos(x) {
	var cos = 1;
	var numerator = process_calculations([x,"*",x]);
	var denominator = 2;

	for (var i = 3; i < 10; i+=2) {
		var next = process_calculations([numerator,"/",denominator]);

		if (i+1 % 4 === 0) {
			cos = process_calculations([cos,"-",next]);
		} else {
			cos = process_calculations([cos,"+",next]);
		}

		numerator = process_calculations([x,"*",x,"*",numerator]);
		denominator = process_calculations([i+1,"*",i,"*",denominator]);
	}

	return cos;
}

function calculate_tan(x) {
	return calculate_sin(x) / calculate_cos(x);
}

function calculate_y(func, x) {
	switch (func) {
		case "sin(x)": return calculate_sin(x);
		case "cos(x)": return calculate_cos(x);
		case "tan(x)": return calculate_tan(x);
	}
}

function draw(func) {
	var canvas = document.getElementById("graph");

	var axes={}, ctx=canvas.getContext("2d");
	axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
	axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	axes.doNegativeX = true;

	showAxes(ctx,axes);
	drawGraph(ctx,axes,"rgb(11,153,11)",1,func);
}

function drawGraph (ctx,axes,color,thick,func) {
	var xx, yy, dx=0.1, x0=axes.x0, y0=axes.y0, scale=axes.scale;
	var iMax = Math.round((ctx.canvas.width-axes.x0)/dx);
	var iMin = Math.round(-x0/dx);

	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	for (var i=iMin;i<=iMax;i++) {
		xx = dx*i; yy = scale*calculate_y(func,xx/scale);
		if (i==iMin) {
			ctx.moveTo(x0+xx,y0-yy);
		} else {
			ctx.lineTo(x0+xx,y0-yy);
		}
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