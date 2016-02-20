var calculation;

function handle_response(data) {
	var line = data.line;
	$("body").append("<p>" + line + "</p>");

	if (calculation.length > 0) {
		line_array = line.split(" ");
		send_request(line_array[line_array.length-1], calculation.shift(), calculation.shift());
	}
}

function send_request(arg1, op, arg2) {
	$.ajax("http://127.0.0.1:8000/", {
		type: "GET",
		data: {
			"arg1": arg1,
			"arg2": arg2,
			"op": op
		},
    	crossDomain: true,
    	dataType: "jsonp",
		success: handle_response
	});
}

function handle_click() {
	calculation = $("#calculation").val().split(" ");

	send_request(calculation.shift(), calculation.shift(), calculation.shift());
}

$(document).ready(function () {
    $('#submit_button').click(handle_click);
});