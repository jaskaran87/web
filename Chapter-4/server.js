var static = require('node-static');
var http = require('http');


// Create a node-static server instance listening on port 8181
var file = new(static.Server)();
 
// We use the http module’s createServer function and
// use our instance of node-static to serve the files
var app = http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(8181);

console.log('Server Start on localhost:8181');

// Use socket.io JavaScript library for real-time web applications
var io = require('socket.io').listen(app);

// Let's start managing connections...
// .on listen to the event

io.sockets.on('connection', function (socket){
    console.log('io.sockets.on');
    //console.log(socket);
    // Handle 'message' messages
    socket.on('message', function (message) {
        log('S --> Got message: ', message);
        socket.broadcast.to(message.channel).emit('message',  message.message);
    });

    // Handle 'create or join' messages
    socket.on('create_or_join', function (channel) {
        console.log('12345: '+ channel);
        var numClients = 0;
        //console.log(io.of('/').in(channel));
        var usersInRoom = io.of('/').in(channel).clients;
        var numClients = usersInRoom.length;

        // First client joining...
        if (numClients == 0){
            console.log('0');
            socket.join(channel);
            socket.emit('created', channel);
            // Second client joining...
        } else if (numClients == 1) {
            console.log('1');
            // Inform initiator...
            io.sockets.in(channel).emit('remotePeerJoining', channel);
            // Let the new peer join channel
            socket.join(channel);
            socket.broadcast.to(channel).emit('broadcast_joined', 'S -->  broadcast(): client ' + socket.id + ' joined channel '  + channel);
        } else { // max two clients
            console.log("Channel full!");
            socket.emit('full', channel);
        }
        
    }); 

    // Handle 'response' messages
    socket.on('response', function (response) {
        log('response handle --> Got response: ', response);
        // Just forward message to the other peer
        
        socket.broadcast.to(response.channel).emit('client_response',response.message);
    });

    // Handle 'Bye' messages
    socket.on('Bye', function(channel){
        // Notify other peer
        socket.broadcast.to(channel).emit('Bye');

        // Close socket from server's side
        socket.disconnect();
    });

    // Handle 'Ack' messages
    socket.on('Ack', function () {
        console.log('Got an Ack!');
        // Close socket from server's side

        socket.disconnect();
    });

    // Utility function used for remote logging
    function log(){
        var array = [">>> "];
        for (var i = 0; i < arguments.length; i++) {
            array.push(arguments[i]);
        }
        socket.emit('log', array);
    }
});
 