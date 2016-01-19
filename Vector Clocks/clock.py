import json
import random
import socket

configuration_file_name = sys.argv[0]
own_index = sys.argv[1]

# own connection information
ip = socket.gethostname()
port = 5555

# assign configuration to an array
configuration = configuration_file_name.read()
nodes = configuration.splitlines()

# initialize a local copy of the vector clock
clock = [0] * len(nodes)

# start receiving messages
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((ip, port))

while 1:
	perform_action()

	data, addr = s.recvfrom(1024)

	msg = json.loads(data)
	adjust_clock(msg.clock)

	print('r ' + msg.id + ' [' + ' '.join(msg.clock) + '] [' + ' '.join(clock) + ']')

def adjust_clock(received_clock):
	for i in range(len(clock)):
		if i != own_index:
			clock[i] = max(clock[i], received_clock[i])
		else:
			clock[i] = clock[i] + 1

def local_event():
	clock_increase = random.randint(1, 5)
	clock[own_index] += clock_increase
	print('l ' + clock_increase)

def send_message():
	target = own_index
	while target == own_index:
		target = random.randint(0, len(nodes)-1)
	
	msg = {}
	msg['id'] = nodes[own_index].split(' ')[0]
	msg['clock'] = clock
	s.sendto(json.dumps(msg), (target, port))

	print('s ' + nodes[target].split(' ')[0] + ' [' + ' '.join(clock) + ']')

def perform_action():
	n = random()
	if n < 0.5:
		local_event()
	else:
		send_message()