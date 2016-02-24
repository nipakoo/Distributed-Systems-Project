var calculation;

// SET RESULT OF THE LAST CALCULATION TO BE VISIBLE AND CALL NEXT CALCULATION IF NEEDED
function handle_response(data) {
	var line = data.line;
	$("body").append("<p>" + line + "</p>");

	if (calculation.length > 0) {
		line_array = line.split(" ");
		send_request(line_array[line_array.length-1], calculation.shift(), calculation.shift());
	}
}

// SEND MESSAGE TO BACK END WITH ARG1 OP AND ARG2 TO BE CALCULATED TOGETHER
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

// GET VALUE OF CALCULATION FIELD AND SEND CALCULATION REQUEST
function handle_click() {
	calculation = $("#calculation").val().split(" ");

	send_request(calculation.shift(), calculation.shift(), calculation.shift());
}

// SET CLICK BEHAVIOR OF SUBMIT BUTTON
$(document).ready(function () {
    $('#submit_button').click(handle_click);
});