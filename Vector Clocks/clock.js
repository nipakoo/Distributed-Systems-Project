/*
	NAME: Niko Kortström
	STUDENT NUMBER: 014154573
	EMAIL: niko.kortstrom@helsinki.fi
*/

// read command line arguments
var configuration_file = process.argv[2];
var program_id = process.argv[3];

// read configuration into an array and remove possible empty lines
fs = require('fs');
var nodes = fs.readFileSync(configuration_file, 'utf8').split('\n').filter(function(node) {
	return node != '';
});

// find the port assigned for this node
var port;
nodes.forEach(function(line) {
	if (line.split(' ')[0] == program_id) {
		port = line.split(' ')[2]; 
	}
});

if (port == undefined) {
	console.log("Invalid program ID. Exiting.");
	process.exit();
}

// start a server
var server = require('websocket').server, http = require('http');

// create a websocket for the server
var server_socket = new server({
    httpServer: http.createServer().listen(port)
});

// accept incoming connections
server_socket.on('request', function(request) {
	var connection = request.accept('echo-protocol', request.origin);

	// receive incoming messages from the connection
	connection.on('message', function(message) {
		received_data = JSON.parse(message.utf8Data);

		for (var i = 0; i < clock.length; i++) {
			if (i != program_id) {
				clock[i] = Math.max(clock[i], received_data.clock[i]);
			} else {
				clock[i] = clock[i] + 1;
			}
		}

		console.log("r " + received_data.id + " [" + received_data.clock.join(' ') + "] [" + clock.join(' ') + "]");

		connection.close();
	});
});

// initialize a vector clock array
var clock = new Array(nodes.length);
for (var i = 0; i < clock.length; i++) {
	clock[i] = 0;
}

var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

// exit when connection is refused
client.on('connectFailed', function(error) {
	console.log("Attempted to connect to a terminated node. Exiting.");
	process.exit();
});

// send a message when a connection has been established
client.on('connect', function(connection) {
	function send_clock() {
        if (connection.connected) {
        	var message = {
				id: program_id,
				clock: clock
			}

            connection.sendUTF(JSON.stringify(message));
            setTimeout(send_clock, 1000);
        }
    }
    send_clock();
});

var random = require('random-js')();

// increment own clock by 1-5
function local_event() {
	var clock_increase = random.integer(1, 5);
	clock[program_id] += clock_increase;

	console.log("l " + clock_increase);
}

function send_message() {
	var target_id = -1;
	while (target_id < 0) {
		var next_id = random.integer(0, nodes.length-1);
		if (next_id != program_id) {
			target_id = next_id;
		}
	}

	// connect to target server, client callback will handle sending
	var address = "ws://" + nodes[target_id].split(' ')[1] + ":" + nodes[target_id].split(' ')[2] + "/";
	client.connect(address, 'echo-protocol');

	console.log("s " + nodes[target_id].split(' ')[0] + " [" + clock.join(' ') + ']');
}

function choose_event(iterations_left) {
	setTimeout(function() {
		if (iterations_left < 1) {
			console.log("Completed given number of iterations. Exiting");
			process.exit();
		}

		// randomly choose to either perform a local event or send a message
		if (Math.random() < 0.5) {
			local_event();
		} else {
			send_message();
		}

		choose_event(iterations_left - 1)
	}, 1000)
}

console.log("Sleeping ten seconds in order for the user to start all nodes.");
setTimeout(function() {
    console.log("Executing vector clock.");

    choose_event(100);
}, 10000);