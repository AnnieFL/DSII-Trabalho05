const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const isTyping = document.getElementById('type');
const online = document.getElementById('online');


form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function (msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

input.addEventListener('input', function(e) {
    if (input.value != "") {
        if (document.getElementById('type').children[0])
        socket.emit('is typing', 'user',true);
    } else {
        socket.emit('is typing', 'user', false);
    }
});

socket.on('is typing', function (msg, bool) {
    let span = document.getElementById('type').children[0];
    
    if (!span) {
        const item = document.createElement('span');
        item.textContent = msg;
        if (bool) {
            isTyping.appendChild(item);
        }
    } else {
        if (!bool) {
            isTyping.removeChild(span);
        }
    }

    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('online', function (usersOn) {
    online.textContent = "";
    for (let i=0; i<usersOn.length; i++) {
        online.textContent += usersOn[i];
        if (i+2 == usersOn.length) {
            online.textContent += " e ";
        } else if (i+2 < usersOn.length) {
            online.textContent += ", ";
        }
    }
});

//name
const form2 = document.getElementById('name');
const input2 = document.getElementById('change');

form2.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input2.value) {
        socket.emit('set nick', input2.value);
        input2.value = '';
    }
});

socket.on('change nick', function (msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
