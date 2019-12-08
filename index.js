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
    console.log('there is a connection');
    socket.on('disconnect', () => {
        console.log('Bye bye');
    });
    socket.on('Creado', (data) => {
        //io.emit('Creado', data); // <-- este emite a todos
        socket.broadcast.emit('Creado', data); // <-- Este solo emite a otros
    });
    socket.on('chatMessage', (data) => {
        console.log('Emito ' + data);
        
        socket.broadcast.emit('chatMessage', (data));
    });
    socket.on('typing', () => {
        socket.broadcast.emit('typing');
    });
    socket.on('stopedTyping', () => {
        socket.broadcast.emit('stopedTyping');
    });
});
