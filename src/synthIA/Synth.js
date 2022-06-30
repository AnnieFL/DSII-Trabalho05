let msgRepetidas = 0;

const Synth = (msg) => {
    if (msg == "Ola Synth.IA") {
        const resposta = ['Olá!', "Oi...", "Sim...?", ":/", "..."]
        setTimeout(() => ('chat message', `Synth.IA: ${resposta[Math.min(4, msgRepetidas)]}`), 2000)
        msgRepetidas++;
    } 

    if (msg == "Tenha um dia") {
        const resposta = ['bom', 'ótimo', '', 'péssimo', 'mal'];
        setTimeout(()=> io.emit('chat message', `Synth.IA: Tenha um ${resposta[Math.floor(Math.random()*5)]} dia`), 2000);
    }

    if (msg == "Tudo bem Synth.IA?") {
        const resposta = ['Estou bem', 'meh...', "Não...", ">:c"];
        setTimeout(()=> io.emit('chat message', `Synth.IA: ${resposta[Math.floor(Math.random()*4)]}`), 2000);
    }
}

module.exports = {Synth}