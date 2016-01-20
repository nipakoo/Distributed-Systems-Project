import socket
import sys

# read command line arguments
host = ''
port = sys.argv[0]
program_id = sys.argv[1]

# initialize socket for receiving
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((host, port))
s.listen(10)

while 1:
	# accept incoming connection and receive a message
	conn, addr = s.accept()
	received_clock = conn.recv(1024)

	adjust_clock(received_clock.split(' '))

	print('r ' + msg.id + ' [' + received_clock + '] [' + ' '.join(clock) + ']')

	conn.close()

def adjust_clock(received_clock):
	# read vector clock from a file
	clock_file = open(clock.txt)

	# modify the clock
	clock = clock_file.read()
	for i in range(len(clock)):
		if i != program_id:
			clock[i] = max(clock[i], received_clock[i])
		else:
			clock[i] = clock[i] + 1

	# write the changes to the clock file
	clock_file.write(' '.join(clock))