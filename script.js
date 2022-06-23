setTimeout(contatoservidor, 3000);

function contatoservidor () {
    let promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(buscarmensagem);
}

function buscarmensagem(resposta) {
    let mensagenservidor = document.querySelector(".painelmensagem");
    for (let i = 0; i < resposta.data.length; i++) {
        if (resposta.data[i].type === 'message') {
        mensagenservidor.innerHTML = mensagenservidor.innerHTML + `<li class="mensagemnormal">
            <h1>${resposta.data[i].time}</h1>
            <h2>${resposta.data[i].from}</h2>
            <h3>para</h3>
            <h2>Todos:</h2>
            <h3>${resposta.data[i].text}</h3>
            </li>`
        }
        if (resposta.data[i].type === 'status') {
        mensagenservidor.innerHTML = mensagenservidor.innerHTML + `<li class="mensagemstatus">
            <h1>${resposta.data[i].time}</h1>
            <h2>${resposta.data[i].from}</h2>
            <h3>entra na sala...</h3>
            </li>`
        }
        if (resposta.data[i].type === 'private_message') {
        mensagenservidor.innerHTML = mensagenservidor.innerHTML + `<li class="mensagemreservada">
            <h1>${resposta.data[i].time}</h1>
            <h2>${resposta.data[i].from}</h2>
            <h3>reservadamente para</h3>
            <h2>${resposta.data[i].to}:</h2>
            <h3>${resposta.data[i].text}</h3>
            </li>`
        }
    }
}

function enviarmensagem() {
    let mensagemaenviar = document.querySelector(".mensagempraenviar").value;
    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemaenviar);

    requisicao.then(envioCorreto);
    requisicao.catch(envioErrado);
}