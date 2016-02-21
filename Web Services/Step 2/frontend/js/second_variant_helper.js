var calculation;

function handle_calculation_response(data) {
	var line = data.line;
	$("body").append("<p>" + line + "</p>");

	if (calculation.length > 0) {
		line_array = line.split(" ");
		send_calculation(line_array[line_array.length-1], calculation.shift(), calculation.shift());
	}
}

function send_calculation(arg1, op, arg2) {
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
}

function calculation_click() {
	calculation = $("#calculation").val().split(" ");

	send_calculation(calculation.shift(), calculation.shift(), calculation.shift());
}

function draw() {
	var sine = $("#sine").val();
	eval("function func(x) { return Math." + sine + "; }");

	var canvas = document.createElement('canvas');
	$(canvas).width(640).height(480);

	var axes={}, ctx=canvas.getContext("2d");
	axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
	axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	axes.doNegativeX = true;

	showAxes(ctx,axes);
	drawGraph(ctx,axes,func,"rgb(11,153,11)",1);

	$("body").append(canvas);
}

function drawGraph (ctx,axes,func,color,thick) {
	var xx, yy, dx=0.1, x0=axes.x0, y0=axes.y0, scale=axes.scale;
	var iMax = Math.round((ctx.canvas.width-x0)/dx);
	var iMin = Math.round(-x0/dx);
	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	for (var i=iMin;i<=iMax;i++) {
		xx = dx*i; yy = scale*func(xx/scale);
		if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
		else         ctx.lineTo(x0+xx,y0-yy);
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

$(document).ready(function () {
    $('#calculation_button').click(calculation_click);
    $('#sine_button').click(draw)
});