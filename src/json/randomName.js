const axios = require('axios');

const randomName = async () => {
    const URL = `https://catfact.ninja/breeds`
    
    //CHAMADA HTTP
    try {
        const resposta = await axios.get(URL);

        return resposta.data.data[Math.floor(Math.random()*25)].breed;
    } catch (error) {
        console.log({ error });
        return null;
    }
}

module.exports = { randomName };