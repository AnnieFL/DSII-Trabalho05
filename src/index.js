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

io.on('connection', async(socket) => {
    socket.client.nick = await randomName();
    let cliente = {
        nick: socket.client.nick,
        id: socket.client.id,
        typing: false
    }
    usersOn.push(cliente);
    io.to(socket.client.id).emit('set user', `${socket.client.id}`)
    io.emit('chat message', `Synth.IA: ${socket.client.nick} entrou, digam oi!`)
    io.emit('online', usersOn);

    socket.on('chat message', (msg) => {
        if (msg.trim() != "") {
            io.emit('chat message', `${socket.client.nick}: ${msg}`);
        }

        //Synth(msg);
    });

    socket.on('set nick', (msg) => {
        if (msg.trim() != "") {
            const oldNick = socket.client.nick;
            socket.client.nick = msg;
            const novo = usersOn.map(user => {
                if (user.id == socket.client.id) {
                    user.nick = msg
                }
                return user
            })

            usersOn = novo

            io.emit('chat message', `Synth.IA: ${oldNick} agora é ${msg}, lembrem-se disso!`);
            io.emit('online', usersOn);

            /*const oldNick = socket.client.nick;
            for (let i = 0; usersOn.filter((e) => e == socket.client.nick) != []; i++) {
                if (usersOn.filter((e) => e == socket.client.nick + i) != []) {
                    socket.client.nick += `${i}`
                }
            }
            socket.client.nick = msg;
            usersOn[usersOn.indexOf(oldNick)] = msg;
    
            io.emit('chat message', `Synth.IA: ${oldNick} agora é ${msg}, lembrem-se disso!`);
            io.emit('online', usersOn);
            */
        }

    })

    socket.on('is typing', (msg, bool) => {
        usersOn = usersOn.map(user => {
            if (user.id == socket.client.id) {
                user.typing = bool
            }
            return user
        });

        let digitando = usersOn.filter(user => user.typing);

        socket.broadcast.emit('is typing', `${JSON.stringify(digitando)}`, bool);
    })

    socket.on('disconnect', () => {
        usersOn = usersOn.filter((e) => e.id != socket.client.id);
        io.emit('chat message', `Synth.IA: ${socket.client.nick} saiu... F`);
        io.emit('online', usersOn);
    })

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});