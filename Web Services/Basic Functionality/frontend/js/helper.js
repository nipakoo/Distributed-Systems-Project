function handle_response(data) {
	$("body").append("<p>" + data.line + "</p>");
}

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

$(document).ready(function () {
    $('#submit_button').click(send_calculation);
});