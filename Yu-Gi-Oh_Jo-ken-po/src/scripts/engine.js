const state = {
  score: {
    playerScore: 0,
    aiScore: 0,
    caixaScore: document.getElementById("pontos"),
  },
  cardSprites: {
    avatar: document.getElementById("card_image"),
    nome: document.getElementById("card_nome"),
    tipo: document.getElementById("card_tipo"),
  },
  fieldCards: {
    player: document.getElementById("player_field"),
    ai: document.getElementById("AI_field"),
  },
  actions: {
    botao: document.getElementById("next-duelo"),
  },
};

const usuarioLado = {
  player1: "card_player",
  player2: "card_AI",
};

const cartaDados = [
  {
    id: 0,
    nome: "Dragão branco dos olhos azuis",
    tipo: "Papel",
    img: "./src/assets/icons/dragon.png",
    GanhaPra: [1],
    PerdePra: [2],
  },
  {
    id: 1,
    nome: "Mago Negro",
    tipo: "Pedra",
    img: "./src/assets/icons/magician.png",
    GanhaPra: [2],
    PerdePra: [0],
  },
  {
    id: 2,
    nome: "Exodia",
    tipo: "Tesoura",
    img: "./src/assets/icons/exodia.png",
    GanhaPra: [0],
    PerdePra: [1],
  },
];

async function getIdCartaAleatoria() {
  const indiceAleatorio = Math.floor(Math.random() * cartaDados.length);
  return cartaDados[indiceAleatorio].id;
}

async function pegarCartaSelecionada(indice) {
  state.cardSprites.avatar.src = cartaDados[indice].img;
  state.cardSprites.nome.innerText = cartaDados[indice].nome;
  state.cardSprites.tipo.innerText = "Atributo : " + cartaDados[indice].tipo;
}

async function removerTodasCartas() {
  let cartas = document.querySelector(".card_caixa#card_AI");
  let elementosImg = cartas.querySelectorAll("img");
  elementosImg.forEach((elemento) => {
    elemento.remove();
  });

  cartas = document.querySelector(".card_caixa#card_player");
  elementosImg = cartas.querySelectorAll("img");
  elementosImg.forEach((elemento) => {
    elemento.remove();
  });
}

async function verResultadoDuelo(playerCartaId, aiCartaId) {
  let dueloResultado = "Empate";
  let playerCarta = cartaDados[playerCartaId];

  if (playerCarta.GanhaPra.includes(aiCartaId)) {
    dueloResultado = "Vitória";
    tocarAudio(dueloResultado);
    state.score.playerScore++;
  } else if (playerCarta.PerdePra.includes(aiCartaId)) {
    dueloResultado = "Derrota";
    tocarAudio(dueloResultado);
    state.score.aiScore++;
  }

  return dueloResultado;
}

async function mostrarBotao(resultadoDuelo) {
  state.actions.botao.innerText = resultadoDuelo;
  state.actions.botao.style.display = "block";
}

async function updateScore() {
  state.score.caixaScore.innerText = `Win : ${state.score.playerScore}   Lose : ${state.score.aiScore}`;
}

async function setCampoCarta(cartaId) {
  await removerTodasCartas();
  let aiCartaId = await getIdCartaAleatoria();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.ai.style.display = "block";

  state.cardSprites.nome.innerText = "";
  state.cardSprites.tipo.innerText = "";

  state.cardSprites.avatar.src = "";

  state.fieldCards.player.src = cartaDados[cartaId].img;
  state.fieldCards.ai.src = cartaDados[aiCartaId].img;

  let resultadoDuelo = await verResultadoDuelo(cartaId, aiCartaId);

  await mostrarBotao(resultadoDuelo);
  await updateScore();
}

async function criarCartaImagem(cartaId, usuario) {
  const cartaImg = document.createElement("img");
  cartaImg.setAttribute("height", "100px");
  cartaImg.setAttribute("src", "./src/assets/icons/card-back.png");
  cartaImg.setAttribute("data-id", cartaId);
  cartaImg.classList.add("carta");

  if (usuario === usuarioLado.player1) {
    cartaImg.addEventListener("click", () => {
      setCampoCarta(cartaImg.getAttribute("data-id"));
    });
    cartaImg.addEventListener("mouseover", () => {
      pegarCartaSelecionada(cartaId);
    });
  }

  return cartaImg;
}

async function comprarCartas(qtd, usuario) {
  for (let i = 0; i < qtd; i++) {
    const cartaId = await getIdCartaAleatoria();
    const cartaIMG = await criarCartaImagem(cartaId, usuario);

    document.getElementById(usuario).appendChild(cartaIMG);
  }
}

async function tocarAudio(status) {
  if (status === "Vitória") {
    const audio = new Audio(`./src/assets/audios/win.wav`);
    audio.play();
  } else {
    const audio = new Audio(`./src/assets/audios/lose.wav`);
    audio.play();
  }
}

async function resetDuelo() {
  state.cardSprites.avatar.src = "";
  state.actions.botao.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.ai.style.display = "none";

  inicair();
}

function inicair() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.ai.style.display = "none";
  comprarCartas(5, usuarioLado.player1);
  comprarCartas(5, usuarioLado.player2);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

inicair();
