var state = {board: [], currentGame: [], savedGames: []};

function start() {
    readLocalStorage(); //Local Storage funciona para persistir os dados da página, porém é uma forma rudementar para guardar dados
    createBoard();
    newGame();
}

function readLocalStorage() {
    if (!window.localStorage) {
        return;
    }                                                   //.getItem() serve para ler o conteúdo
    var savedGamesFromLocalStorage = window.localStorage.getItem("saved-games");
    if (savedGamesFromLocalStorage) {
        state.savedGames = JSON.parse(savedGamesFromLocalStorage);
    } //JSON.parse() é responsável por converter uma string em JSON
}

function writeToLocalStorage() { //.setItem() serve para escrever o conteúdo (Precisa de uma chave e um valor)
    window.localStorage.setItem("saved-games", JSON.stringify(state.savedGames));
}  //JSON.stringfy() é responsável por transformar um elemento JSON em string

function createBoard() {
    start.board = [];

    for (var i = 1; i <= 60; i++) {
        state.board.push(i);
    }
}

function newGame() {
    resetGame();
    render();

    console.log(state.currentGame);
}

function render() {
    renderBoard();
    renderButtons();
    renderSavedGames();
}

function renderBoard() {
    var divBoard = document.querySelector("#mega-sena-board");
    divBoard.innerHTML = "";

    var ulNumbers = document.createElement("ul");
    ulNumbers.classList.add("numbers");

    for (var i = 0; i < state.board.length; i++) {
        var currentNumber = state.board[i];
        var liNumber = document.createElement("li");
        liNumber.classList.add("number"); //Se usar .remove exclui todo CSS de uma classe

        liNumber.textContent = currentNumber;
        liNumber.addEventListener('click', handleNumberClick);
        if (isNumberInGame(currentNumber)) {
            liNumber.classList.add("selected-number");
        }

        ulNumbers.appendChild(liNumber);
    }

    divBoard.appendChild(ulNumbers);
}

function handleNumberClick(event) {
    var value = Number(event.currentTarget.textContent);
    
    if (isNumberInGame(value)) {
        removeNumberFromGame(value);
    }
    else {
        addNumberToGame(value);
    }
    console.log(state.currentGame)
    render();
}

function renderButtons() {
    var divButtons = document.querySelector("#mega-sena-buttons");
    divButtons.innerHTML = ""

    var buttonNewGame = createNewGameButton();
    var buttonRandomGame = createRandomGameButton();
    var buttonSaveGame = createSaveGameButton();

    divButtons.appendChild(buttonNewGame);
    divButtons.appendChild(buttonRandomGame);
    divButtons.appendChild(buttonSaveGame);
}

function createNewGameButton() {
    var button = document.createElement("button");
    button.textContent = "Novo Jogo";
    button.addEventListener("click", newGame);
    return button;
}

function createRandomGameButton() {
    var button = document.createElement("button");
    button.textContent = "Jogo Aleatório";
    button.addEventListener("click", randomGame);
    return button;
}

function createSaveGameButton() {
    var button = document.createElement("button");
    button.textContent = "Salvar Jogo";
    button.disabled = !isGameComplete();
    button.addEventListener("click", saveGame);
    return button;
}

function renderSavedGames() {
    var divSavedGames = document.querySelector("#mega-sena-save-games");
    divSavedGames.innerHTML = "";

    if (state.savedGames.length === 0) {
        divSavedGames.innerHTML = "<p>Nenhum jogo salvo</p>"
    }
    else {
        var ulSavedGames = document.createElement("ul");
        for (var i = 0; i < state.savedGames.length; i++) {
            var currentGame = state.savedGames[i];

            console.log(currentGame.join(" - ")); //split separa um string e join junta um string de outra maneira

            var liGame = document.createElement("li");
            liGame.textContent = currentGame.join(" - ");

            ulSavedGames.appendChild(liGame);
        }
        divSavedGames.appendChild(ulSavedGames);
    }
}

function addNumberToGame(numberToAdd) {
    if (numberToAdd < 1 || numberToAdd > 60) {
        console.error("Número Inválido", numberToAdd);
        return;
    }

    if (state.currentGame.length >= 6) {
        console.error("O jogo já está completo.")
        return;
    }

    if (isNumberInGame(numberToAdd)) {
        console.error("Este número já está no jogo.", numberToAdd);
        return;
    }

    state.currentGame.push(numberToAdd);
}

function removeNumberFromGame(numberToRemove) {
    if (numberToRemove < 1 || numberToRemove > 60) {
        console.error("Número Inválido", numberToRemove);
        return;
    }
    var newGame = [];
    for (var i = 0; i < state.currentGame.length; i++) {
        var currentNumber = state.currentGame[i];
        if (currentNumber === numberToRemove) {
            continue; //Função para FOR que permite que a repetição não faça nada
        }
        newGame.push(currentNumber);
    }

    state.currentGame = newGame;
}

function isNumberInGame(numberToCheck) {
    //if (state.currentGame.includes(numberToCheck)) {
    //    return true;
    //}
    //return false;
    return state.currentGame.includes(numberToCheck);
}

function isGameComplete() {
    return state.currentGame.length === 6;
}

function saveGame() {
    if (!isGameComplete()) {
        console.error("O jogo não está completo.");
        return;
    }
    state.savedGames.push(state.currentGame);
    writeToLocalStorage();
    newGame();
    console.log(state.savedGames);
}

function resetGame() {
    state.currentGame = [];
}

function randomGame() {
    resetGame();

    while(!isGameComplete()) {
        var randomNumber = Math.ceil(Math.random() * 60);
        //Math é a propriedade do JS que atua como calculadora interna
        addNumberToGame(randomNumber);
    }
    console.log(state.currentGame);
    render();
}

start()