// SET RESULT OF THE LAST CALCULATION TO BE VISIBLE
function handle_response(data) {
	$("body").append("<p>" + data.line + "</p>");
}

// SEND MESSAGE TO BACK END WITH ARG1 OP AND ARG2 TO BE CALCULATED TOGETHER
function send_calculation() {
	$.ajax("http://127.0.0.1:8000/", {
		type: "GET",
		data: {
			"arg1": $("#argument_1").val(),
			"arg2": $("#argument_2").val(),
			"op": $("#operator").val()
		},
    	crossDomain: true,
    	dataType: "jsonp",
		success: handle_response
	});
}

// SET CLICK BEHAVIOR OF SUBMIT BUTTON
$(document).ready(function () {
    $('#submit_button').click(send_calculation);
});