const express = require('express');

const app = express();
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.set('view engine', 'pug');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/demo', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });

    socket.on('post comment', msg => {
        console.log(msg);
        // io.emit('post comment', msg);
        socket.broadcast.emit('post comment', msg);
    });

    socket.on('error', function (err) {
        console.log(err);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});