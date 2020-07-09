document.addEventListener("DOMContentLoaded", () => {
    let board = document.getElementById("tic-tac-toe-board");
    let xsTurn = true;
    const blankBoard = [null, null, null, null, null, null, null, null, null]
    let squareValues = blankBoard;
    let forcedWinner = null;
    const winningCombos = ['012','345', '678', '036', '147', '258', '048', '246'];
    loadGame();

    document.getElementById("new-game-button").disabled = true;


    function updateStatus (winner) {
        if (winner) document.getElementById("game-status").innerHTML = `Winner: ${winner}`;
        document.getElementById("new-game-button").disabled = false;
        document.getElementById("give-up-button").disabled = true;
        if (!winner) document.getElementById("give-up-button").disabled = false;
    }

    function saveGame() {
        let savedValues = JSON.stringify(squareValues);
        let savedTurn = JSON.stringify(xsTurn);
        localStorage.setItem("values", savedValues);
        localStorage.setItem("turn", savedTurn);
    }

    function loadGame() {
        let loadedValues = localStorage.getItem("values");
        if (loadedValues){
            squareValues = JSON.parse(loadedValues);
            for (let i=0; i<squareValues.length; i++){
                let id = `square-${i}`;
                if (squareValues[i] === 'X'){
                    document.getElementById(id).style.backgroundImage = "url('player-x.svg')";
                } else if (squareValues[i] === 'O'){
                    document.getElementById(id).style.backgroundImage = "url('player-o.svg')";
                }
            }
        }
        let loadedTurn = localStorage.getItem("turn");
        if (loadedTurn) xsTurn = JSON.parse(loadedTurn);
        updateStatus(getWinner(squareValues));

    }

    let boardEvent = event =>{
        if (getWinner(squareValues)) {
            console.log(squareValues);
            return undefined;
        }
        let squareNumber = Number(event.target.id.slice(event.target.id.indexOf('-')+1));
        if (!squareValues[squareNumber]){
            if(xsTurn){
                event.target.style.backgroundImage = "url('player-x.svg')";
                squareValues[squareNumber] = "X";
                xsTurn = false;
            } else {
                event.target.style.backgroundImage = "url('player-o.svg')";
                squareValues[squareNumber] = "O";
                xsTurn = true;
            }
        }
        saveGame();
        let winner = getWinner(squareValues);
        console.log(winner);
        if (winner) {
            updateStatus(winner);
        }
    }

    board.addEventListener("click", boardEvent);

    let newGame = document.getElementById("new-game-button");
    newGame.addEventListener("click", event => {
        for (let i=0; i<squareValues.length; i++){
            document.getElementById(`square-${i}`).style.backgroundImage = "initial";
            squareValues[i] = null;
        }
        document.getElementById("game-status").innerHTML = "";
        xsTurn = true;
        forcedWinner = null;
        document.getElementById("give-up-button").disabled = false;
        document.getElementById("new-game-button").disabled = true;
        saveGame();
        // squareValues = blankBoard;
    })

    document.getElementById("give-up-button").addEventListener("click", event => {
       if (xsTurn) {
           forcedWinner = "O";
       } else {
           forcedWinner = "X";
       }
       updateStatus(forcedWinner);
    });

    function getWinner(squares) {
        if (forcedWinner) return forcedWinner;
        let winner = false;
        winningCombos.forEach(element => {
            let l0 = squares[Number(element[0])];
            let l1 = squares[Number(element[1])];
            let l2 = squares[Number(element[2])];
            //console.log(l0, l1, l2);
            if (l0 && l1 && l2) {
                if (l0 === l1 && l1 === l2) {
                    winner = l0;
                }
            }
        });
        if (winner) {
            return winner;
            document.getElementById("give-up-button").disabled = true;
        }
        else if (!squares.includes(null)) {
            return "None";
        } else {
            return false;
        }
    }
})
