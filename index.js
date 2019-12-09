let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/css/main.css', (req, res) => {
    res.sendFile(__dirname + '/css/main.css');
});

http.listen(3000, () =>{
    console.log('Connection done!');
});

io.on('connection', (socket) => {
    //Avisa que hay una nueva coneccion
    console.log('there is a connection');
    //Avisa que se perdio una coneccion
    socket.on('disconnect', () => {
        console.log('Bye bye');
    });

    socket.on('Creado', (data) => {
        //io.emit('Creado', data); // <-- este emite a todos
        socket.broadcast.emit('Creado', data); // <-- Este solo emite a otros
    });

    socket.on('chatMessage', (msg) => {
        // console.log(msg);
        socket.broadcast.emit('chatMessage', (msg));
    });

    socket.on('typing', (name) => {
        socket.broadcast.emit('typing', name);
    });

    socket.on('stopedTyping', (name) => {
        socket.broadcast.emit('stopedTyping', name);
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
    });

    socket.on('whosOnline', (data) => {
        socket.broadcast.emit('whosOnline', (data));
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
    });
});
