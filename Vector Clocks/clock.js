// read command line arguments
var configuration_file = process.argv[2];
var program_id = process.argv[3];

// read configuration into an array
fs = require('fs');
var nodes = fs.readFileSync(configuration_file, 'utf8').split('\n');

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
var http = require('http');
var server = http.createServer(function(request, response) {});
server.listen(port)

// create a websocket
var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
	httpServer: server
});

// accept incoming connections
wsServer.on('request', function(r) {
	var connection = r.accept('echo-protocol', r.origin);

	// receive incoming messages from the connection
	connection.on('message', function(message) {
		for (var i = 0; i < clock.length; i++) {
			if (i != program_id) {
				clock[i] = Math.max(clock[i], message.clock[i]);
			} else {
				clock[i] = clock[i] + 1;
			}
		}

		console.log("r " + message.id + "[ " + message.clock.join(' ') + "] [" + message.clock.join(' ') + "]");
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
	connection.send({
		id: program_id,
		clock: clock
	});

	console.log("s " + nodes[target_index].split(' ')[0] + " [" + clock.join(' ') + ']');
});

// increment own clock by 1-5
function local_event() {
	clock_increase = Math.floor((Math.random() * 5) + 1); 
	clock[program_id] += clock_increase;

	console.log("l " + clock_increase);
}

function send_message() {
	var target_id;
	while (!target_id) {
		var next_id = Math.floor(Math.random() * (nodes.length-1));
		if (next_id != program_id) {
			target_id = next_id;
		}
	}

	// connect to target server, client callback will handle sending
	client.connect("ws://" + nodes[target_id].split(' ')[1] + ":" + nodes[target_id].split(' ')[2], 'echo-protocol');
}

console.log("Sleeping ten seconds in order for the user to start all nodes.");
setTimeout(function() {
    console.log("Executing vector clock.");

    for (var i = 0; i < 100; i++) {
		// randomly choose to either perform a local event or send a message
		if (Math.random() < 0.5) {
			local_event();
		} else {
			send_message();
		}
	}
}, 10000);