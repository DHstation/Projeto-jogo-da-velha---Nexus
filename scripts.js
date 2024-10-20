// Seleciona todos os elementos que representam as células do tabuleiro (data-cell)
const cellElements = document.querySelectorAll('[data-cell]');

// Seleciona o container do tabuleiro (data-container)
const container = document.querySelector('[data-container]');

// Elemento que exibirá a mensagem de quem venceu (data-winning-message-text)
const winnerMessageTextElement = document.querySelector('[data-winning-message-text]');

// Elemento que exibe a tela de mensagem de vitória (data-winning-message)
const winningMessage = document.querySelector('[data-winning-message]');

// Botão para resetar o placar (buttonReset)
const resetButton = document.querySelector('#buttonReset');

// Botão para reiniciar o jogo (data-restart-button)
const restartButton = document.querySelector('[data-restart-button]');

// Elementos e variáveis para manter a contagem de vitórias do jogador X
let countX = document.querySelector('#count-x');
let countXText = 0

// Elementos e variáveis para manter a contagem de vitórias do jogador O
let countO = document.querySelector('#count-o');
let countOText = 0

// Elementos e variáveis para manter a contagem de empates
let countDraws = document.querySelector('#count-draws');
let countDrawsText = 0

// Variável para controlar de quem é a vez (true = círculo, false = X)
let isCircleTurn;

// Combinações vencedoras no jogo da velha
const winningCombinations = [
  [0, 1, 2], // Linha superior
  [3, 4, 5], // Linha do meio
  [6, 7, 8], // Linha inferior
  [0, 3, 6], // Coluna esquerda
  [1, 4, 7], // Coluna central
  [2, 5, 8], // Coluna direita
  [0, 4, 8], // Diagonal principal
  [2, 4, 6]  // Diagonal secundária
];

// Função que inicia o jogo, limpa o tabuleiro e define o evento de clique para as células
const startGame = () => {
  isCircleTurn = false; // Começa com o jogador X
  for (const cell of cellElements) {
    cell.classList.remove('circle'); // Remove a marca de círculo
    cell.classList.remove('x'); // Remove a marca de X
    cell.removeEventListener('click', handleClick); // Remove event listener antigo
    cell.addEventListener('click', handleClick, {once: true}); // Adiciona evento de clique nas células
  }

  setBoardHoverClass(); // Atualiza a indicação visual de quem joga
  winningMessage.classList.remove('show-winning-message') // Esconde a mensagem de vitória
}

// Função que exibe a mensagem de fim de jogo, verificando se houve empate ou vitória
const endGame = (isDraw) => {
   if (isDraw) {
    winnerMessageTextElement.innerText = 'Empate'; // Exibe empate
   } else {
    winnerMessageTextElement.innerText = isCircleTurn 
    ? 'O Venceu!' // Se for a vez do círculo, círculo venceu
    : 'X venceu!'; // Senão, X venceu
   }
   winningMessage.classList.add('show-winning-message'); // Exibe a tela de mensagem de vitória
}

// Função que incrementa a contagem de empates
const countDrawPlayer = () => {
  countDrawsText += 1;
  countDraws.textContent = countDrawsText; // Atualiza a exibição do número de empates
};

// Função que incrementa a contagem de vitórias dos jogadores
const countPlayer = () => {
  const classToAdd = isCircleTurn ? 'circle' : 'x';

  if (classToAdd == 'x') {
    countXText += 1;
    countX.textContent = countXText; // Atualiza a contagem de vitórias do jogador X
  } else if(classToAdd == 'circle') {
    countOText += 1;
    countO.textContent = countOText; // Atualiza a contagem de vitórias do jogador O
  } else {
    alert("Erro!"); // Alerta de erro, caso ocorra um estado inválido
  }
}

// Função que reseta o placar de vitórias e empates
const buttonReset = () => {
  countXText = 0;
  countOText = 0;
  countDrawsText = 0;
  countX.textContent = countXText;
  countO.textContent = countOText;
  countDraws.textContent = countDrawsText;
}

// Função que verifica se o jogador atual venceu
const checkForWin = (currentPlayer) => {
  return winningCombinations.some(combinetion => {
    return combinetion.every(index => {
      return cellElements[index].classList.contains(currentPlayer); // Verifica se todas as células da combinação têm a marca do jogador atual
    });
  });
}

// Função que verifica se houve um empate
const checkForDraw = () => {
  return [...cellElements].every((cell) => {
    return cell.classList.contains('x') || cell.classList.contains('circle'); // Verifica se todas as células estão preenchidas
  });
};

// Função que adiciona a marca do jogador atual na célula
const placeMark = (cell, classToAdd) => {
  cell.classList.add(classToAdd);
}

// Função que define a classe de hover no tabuleiro, indicando a vez de quem joga
const setBoardHoverClass = () => {
  container.classList.remove('circle');
  container.classList.remove('x');

  if (isCircleTurn) {
    container.classList.add("circle"); // Indica que é a vez do círculo
  } else {
    container.classList.add("x"); // Indica que é a vez do X
  }
};

// Função que alterna a vez entre os jogadores
const swapTurns = () => {
  isCircleTurn = !isCircleTurn; // Alterna entre círculo e X
  setBoardHoverClass(); // Atualiza o hover no tabuleiro
};

// Função que lida com o clique em uma célula
const handleClick = (e) => {
  const cell = e.target;
  const classToAdd = isCircleTurn ? 'circle' : 'x';

  placeMark(cell, classToAdd); // Coloca a marca do jogador na célula

  const isWin = checkForWin(classToAdd); // Verifica se houve vitória
  const isDraw = checkForDraw(); // Verifica se houve empate

  if (isWin) {
    endGame(false); // Se houver vitória, finaliza o jogo
    countPlayer(); // Incrementa a contagem de vitórias
  } else if (isDraw) {
    endGame(true); // Se houver empate, finaliza o jogo
    countDrawPlayer(); // Incrementa a contagem de empates
  } else {
    swapTurns(); // Alterna a vez se o jogo continuar
  }
}

buttonReset(); // Inicializa o placar zerado
startGame(); // Inicia o jogo

resetButton.addEventListener('click', buttonReset); // Adiciona evento ao botão de resetar o placar
restartButton.addEventListener('click', startGame); // Adiciona evento ao botão de reiniciar o jogo
