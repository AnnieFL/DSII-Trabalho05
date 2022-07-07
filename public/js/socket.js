const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const isTyping = document.getElementById('type');
const online = document.getElementById('online');


form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('is typing', 'Esta digitando.....', false);
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});



socket.on('set user', function(msg) {
    user.id = msg
});

input.addEventListener('input', function(e) {
    if (input.value != "") {
        socket.emit('is typing', 'Esta digitando.....', true);
    } else {
        socket.emit('is typing', 'Esta digitando.....', false);
    }
});

socket.on('is typing', function(dados, bool) {
    let userTyping = JSON.parse(dados)
    let span = document.getElementById('type').children[0];
    let complemento = "";

    userTyping = userTyping.filter(usuario => socket.io.engine.id != usuario.id)
        .map(usuario => usuario.nick)

    if (!userTyping[0]) {
        span.textContent = "";
        return
    } else if (userTyping.length <= 3) {
        let complemento = userTyping.length > 1 ? " estão digitando...." : " está digitando...."
        span.textContent = userTyping.join(', ') + complemento;
    } else {
        span.textContent = "Vários usuarios estão digitando"
    }

    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('online', function(usersOn) {
    online.innerHTML = "";
    for (let i = 0; i < usersOn.length; i++) {
        online.innerHTML += usersOn[i].nick;
        if (i + 1 < usersOn.length) {
            online.innerHTML += "<br/>";
        }
    }
});

//name
const form2 = document.getElementById('name');
const input2 = document.getElementById('change');

form2.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input2.value) {
        socket.emit('set nick', input2.value);
        input2.value = '';
    }
});

socket.on('change nick', function(msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});