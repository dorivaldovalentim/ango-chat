const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const port = process.env.PORT || 3000;
const { Server } = require('socket.io');
const io = new Server(server);

/** Defini o pug como o template engine */
app.set('view engine', 'pug');

/** Defini a pasta views como a pasta dos components de view */
app.set('views', path.join(__dirname, 'views'));

/** Defini a pasta public como a contedora dos arquivos estáticos */
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('home'));

io.on('connection', (socket) => {
    io.emit('connected user', { userId: socket.id, message: `${socket.id} se conectou.` });

    socket.on('chat message', (message) => {
        io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
        io.emit('disconnected user', { userId: socket.id, message: `${socket.id} se desconectou.` });
    })
});

server.listen(port, () => console.log(`App listening on port ${port} ✌❤`));
