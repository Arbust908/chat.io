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

let onlines = [];

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

    socket.on('whosOnline', (data) => {
        onlines.push(data);
        io.emit('whosOnline', (onlines));
    });

    socket.on('leave', (data) => {
        let namePos = onlines.indexOf(data);
        if (namePos >= 0) {
            onlines.splice(namePos, 1);
            io.emit('whosOnline', (onlines));
        } else {
            console.log('Phantom '+data);
        }
    });
});
