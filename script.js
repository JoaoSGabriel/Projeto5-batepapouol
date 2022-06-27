setInterval(contatoservidor, 3000);
let guardanome;
let nomeusuario;
buscarparticipantes();

document.querySelector(".nomedaentrada").addEventListener("keypress", function(e) {
    if(e.key==='Enter') {
        entrando();
        ativaenter();
    }
});

function ativaenter() {
    document.querySelector(".mensagempraenviar").addEventListener("keypress", function(e) {
        if(e.key==='Enter') {
            enviarmensagem();
        }
    });
}

function entrando() {
nomeusuario = document.querySelector(".nomedaentrada").value;
guardanome = {
    name: `${nomeusuario}`,
}
let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ", guardanome);
requisicao.then(podeEntrar);
requisicao.catch(naopodeEntrar);
}

function podeEntrar () {
    setInterval(usuarioOnline, 5000);
    escondetelas();
}

function escondetelas() {
    document.querySelector(".teladeentrada").classList.add('usuarioentrou');
    setTimeout(escondeseguntela, 5000);
}

function escondeseguntela () {
    document.querySelector(".telaentradaloading").classList.add('usuarioentrou');
}

function usuarioOnline () {
    let requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", guardanome);
    requisicao.then(funcionou);
}

function funcionou () {
    return;
}

function naopodeEntrar () {
    alert("Ops... Parece que já existe alguém com esse nome, tente novamente!");
    recarregaPagina();
}

function recarregaPagina() {
    window.location.reload();
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
            <h3>${resposta.data[i].text}</h3>
            </li>`
        }
        if ((resposta.data.to === nomeusuario) || (resposta.data.from === nomeusuario)) {
            mensagenservidor.innerHTML = mensagenservidor.innerHTML + `<li class="mensagemreservada">
            <h1>${resposta.data[i].time}</h1>
            <h2>${resposta.data[i].from}</h2>
            <h3>reservadamente para</h3>
            <h2>${resposta.data[i].to}:</h2>
            <h3>${resposta.data[i].text}</h3>
            </li>`
        }
    }
    let autoscroll = document.querySelector(".painelmensagem li:last-child")
    autoscroll.scrollIntoView();
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
    
    let limpainput = document.querySelector(".fundo");
    limpainput.innerHTML = `<ion-icon name="paper-plane-outline" onclick="enviarmensagem()"></ion-icon>`;
    limpainput.innerHTML = `<input type="text" class="mensagempraenviar" placeholder="Escreva aqui..."/>
    <ion-icon name="paper-plane-outline" onclick="enviarmensagem()"></ion-icon>`;

    document.querySelector(".mensagempraenviar").addEventListener("keypress", function(e) {
        if(e.key==='Enter') {
            enviarmensagem();
        }
    });
}

function envioCorreto () {
    contatoservidor();
}

function envioIncorreto () {
    window.location.reload();
}

function abadeparticipante () {
    document.querySelector(".participanteativo").classList.remove('escondido');
}

function removeabadeparticipante () {
    document.querySelector(".participanteativo").classList.add('escondido');
}

function choose (elemento) {
    let mensagemparaquem = document.querySelector(".usuarios .opaco")
    if (mensagemparaquem !== null) {
        mensagemparaquem.classList.remove('opaco')
    }
    elemento.querySelector(".icone").classList.add('opaco');
}

function choose1 (elemento) {
    let mensagemparaquem = document.querySelector(".visibilidade .opaco")
    if (mensagemparaquem !== null) {
        mensagemparaquem.classList.remove('opaco')
    }
    elemento.querySelector(".icone1").classList.add('opaco');
}

function buscarparticipantes () {
    let promisse = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promisse.then(vamosprocurar)
 }

function vamosprocurar(resposta) {
    participantesonline = resposta.data;
    let listadeparticipantes = document.querySelector(".pessoasonline")
    listadeparticipantes.innerHTML = `<div class="usuarios" onclick="choose(this)">
    <div><ion-icon name="people"></ion-icon> Todos</div>
    <div class="icone opaco"><ion-icon name="checkmark-sharp"></ion-icon></div>
</div>`
    for (let i = 0; i < resposta.data.length; i++) {
        listadeparticipantes.innerHTML += `<div class="usuarios" data-identifier="participant" onclick="choose(this)">
        <div><ion-icon name="person-circle-sharp"></ion-icon> ${resposta.data[i].name}</div>
        <div class="icone"><ion-icon name="checkmark-sharp"></ion-icon></div>
    </div>`
    }

    setTimeout(buscarparticipantes, 10000);
}