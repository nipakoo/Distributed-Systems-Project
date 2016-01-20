import random
import socket
import sys

# read command line arguments
configuration_file = sys.argv[0]
program_id = sys.argv[1]

# initialize socket for sending
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# read the configuration file into an array
nodes = configuration_file.read().splitlines()

if program_id => len(nodes):
	print('Invalid program ID. Exiting.')
	sys.exit()

def local_event():
	# read vector clock from a file
	clock_file = open(clock.txt)

	# modify the clock
	clock = clock_file.read()
	clock_increase = random.randint(1, 5)
	clock[program_id] += clock_increase

	print('l ' + clock_increase)

	# write the changes to the clock file
	clock_file.write(' '.join(clock))

def send_message():
	# choose which node to send the message to by random
	target_index = random.randint(0, len(nodes) - 2)
	if target_index == program_id:
		target_index = target_index + 1

	# establish connection
	try:
		target_host = nodes[target_index].split(' ')[1]
		target_port = nodes[target_index].split(' ')[2]
		s.connect((host, port))
	except socket.error as e:
		print('Attempted to communicate with a terminated node. Exiting.')
		sys.exit()

	clock_file = open(clock.txt)

	print('s ' + nodes[target_index].split(' ')[0] + ' [' + clock_file.read() + ']')

	s.send(clock_file.read())

def perform_action():
	# choose at random which one of the actions to perform next
	n = random()
	if n < 0.5:
		local_event()
	else:
		send_message()

# perform 100 actions before exiting the application
# TODO: LOOK AT KILLING THE SERVER
for i in range(0, 100):
	perform_action()