setInterval(contatoservidor, 3000);
let guardanome;
let nomeusuario;
entrarnobatepapo();

function entrarnobatepapo () {
nomeusuario = prompt("Qual o seu lindo nome?");
guardanome = {
    name: `${nomeusuario}`,
}
let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ", guardanome);
requisicao.then(podeEntrar);
requisicao.catch(naopodeEntrar);
}

function podeEntrar () {
    setInterval(usuarioOnline, 5000);
}

function usuarioOnline () {
    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", guardanome);
    requisicao.then(funcionou);
}

function funcionou () {
    return;
}

function naopodeEntrar () {
    alert("Ops... Parece que já existe alguém com esse nome, tente novamente");
    entrarnobatepapo ();
}

function contatoservidor () {
    let promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promisse.then(buscarmensagem);
}

function buscarmensagem(resposta) {
    let mensagenservidor = document.querySelector(".painelmensagem");
    mensagenservidor.innerHTML = '';
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
    let mensagempronta = {
        from:`${nomeusuario}`,
        to: "todos",
        text: `${mensagemaenviar}`,
        type: "message",
    }
    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagempronta);
    requisicao.then(envioCorreto);
    requisicao.catch(envioIncorreto);
}

function envioCorreto () {
    contatoservidor();
}

function envioIncorreto () {
    window.location.reload();
}