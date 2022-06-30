const express = require('express');
const app = express();
const axios = require('axios');
const { randomName } = require('./json/randomName');
const { Synth } = require('./synthIA/Synth');

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.redirect('html/meu.html');
});

let usersOn = [];

io.on('connection', async (socket) => {
    socket.client.nick = await randomName();
    usersOn.push(socket.client.nick);
    io.emit('chat message', `Synth.IA: ${socket.client.nick} entrou, digam oi!`)
    io.emit('online', usersOn);

    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.client.nick}: ${msg}`);

        //Synth(msg);
    });

    socket.on('set nick', (msg) => {
        const oldNick = socket.client.nick;
        for (let i=0; usersOn.filter((e) => e == socket.client.nick) != []; i++) {
            if (usersOn.filter((e) => e == socket.client.nick + i) != []) {
                socket.client.nick += `${i}`
            }
        }
        socket.client.nick = msg;
        usersOn[usersOn.indexOf(oldNick)] = msg;
        
        io.emit('chat message', `Synth.IA: ${oldNick} agora é ${msg}, lembrem-se disso!`);
        io.emit('online', usersOn);
    })

    socket.on('is typing', (msg, bool) => {
        socket.broadcast.emit('is typing', `${socket.client.nick} está digitando`, bool);
    })

    socket.on('disconnect', () => {
        usersOn = usersOn.filter((e) => e != socket.client.nick);
        io.emit('chat message', `Synth.IA: ${socket.client.nick} saiu... F`);
        io.emit('online', usersOn);
    })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});