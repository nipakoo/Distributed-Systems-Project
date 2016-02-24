var calculation;

function handle_calculation_response(data) {
	var line = data.line;
	$("body").append("<p>" + line + "</p>");

	if (calculation.length > 0) {
		line_array = line.split(" ");
		send_calculation(line_array[line_array.length-1], calculation.shift(), calculation.shift());
	}
}

// ADD SINE RESPONSE TO BE VISIBLE
function handle_sine_response(data) {
	$("body").append("<img src=\"data:image/png;base64," + data.image_string + "\"/>");
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

// SEND SINE PLOTTING REQUEST AND CALL handle_sine_response ON RESPONSE
function send_sine(functions) {
	$.ajax("http://127.0.0.1:8000/sine", {
		type: "GET",
		data: {
			"functions": functions
		},
    	crossDomain: true,
    	dataType: "jsonp",
		success: handle_sine_response
	});
}

function calculation_click() {
	calculation = $("#calculation").val().split(" ");

	send_calculation(calculation.shift(), calculation.shift(), calculation.shift());
}

// GET FUNCTION FROM INPUT FIELD AND PROCEED TO SENDING REQUEST
function sine_click() {
	var sine = $("#sine").val();

	send_sine(sine);
}

// SET BUTTON BEHAVIOR
$(document).ready(function () {
    $('#calculation_button').click(calculation_click);
    $('#sine_button').click(sine_click)
});