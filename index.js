let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/css/main.css', (req, res) => {
    res.sendFile(__dirname + '/css/main.css');
});
app.get('/css/main.min.css', (req, res) => {
    res.sendFile(__dirname + '/css/main.min.css');
});

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/socket.io/socket.io.js');
});

http.listen(3000, () =>{
    console.log('Connection done!');
});

let online = [];
let msgs = [];

io.on('connection', (socket) => {
    socket.join('mainRoom');
    //Avisa que hay una nueva coneccion
    console.log('there is a connection');
    //Avisa que se perdio una coneccion
    socket.on('disconnect', () => {
        console.log('Bye bye');
    });

    socket.on('Creado', () => {
        let data = {
            'People': online,
            'Chat': msgs
        };
        io.to('mainRoom').emit('Creado', data); // <-- este emite a todos
        //socket.to('mainRoom').broadcast.emit('Creado', data); // <-- Este solo emite a otros
    });

    socket.on('chatMessage', (msg) => {
        //console.log(msg);
        msgs.unshift(msg)
        socket.to('mainRoom').emit('chatMessage', (msgs));
    });

    socket.on('typing', (name) => {
        socket.to('mainRoom').broadcast.emit('typing', name);
    });

    socket.on('stopedTyping', (name) => {
        socket.to('mainRoom').broadcast.emit('stopedTyping', name);
    });

    socket.on('joined', (data) => {
        online.push(data);
        //socket.to('mainRoom').broadcast.emit('joined', (data));
    });

    socket.on('whosOnline', (data) => {
        //console.log(data);
        socket.to('mainRoom').broadcast.emit('whosOnline', (online));
    });

    socket.on('leave', (data) => {
        let namePos = online.indexOf(data);
        //console.log(namePos);
        if (namePos >= 0) {
            online.splice(namePos, 1);
        }
        socket.to('mainRoom').broadcast.emit('whosOnline', (online));
        //socket.to('mainRoom').broadcast.emit('leave', (data));
    });
    socket.on('updateMsg', () => {
        if (msgs.length > 0) {
            console.log('Borro');
            msgs.pop();
            socket.to('mainRoom').broadcast.emit('chatMessage', (msgs));
        }
    });
});
