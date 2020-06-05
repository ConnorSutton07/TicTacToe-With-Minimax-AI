let canvas = document.querySelector('canvas');
    ctx = canvas.getContext("2d");
    reset = document.querySelector(".reset");
    hdr = document.getElementById("game-over");

canvas.height = window.innerHeight * (3/5);
canvas.width = window.innerHeight * (3/5);

let canvasX = (window.innerWidth - canvas.width) / 2;
    cLength = canvas.width;
    playerTurn = true;
    gameOver = false;
    length = cLength / 3;
    mouse = 
    {
        x: undefined,
        y: undefined
    }
    // 0 = empty, 1 = player (X), 2 = computer (O)
    board = [[0, 0, 0],
             [0, 0, 0],
             [0, 0, 0]];

window.addEventListener('mousemove', 
    function(e) 
    {
        mouse.x = e.x;
        mouse.y = e.y;
    }
);

reset.addEventListener('click', restart);

canvas.addEventListener('click', () =>
{
    if (playerTurn && !gameOver)
    {
        let top = canvas.offsetTop;
            left = canvas.offsetLeft;
            row = 0;
            col = 0;

        if (mouse.y < (top + length)) row = 0;
        else if (mouse.y < (top + (length * 2))) row = 1;
        else row = 2;

        if (mouse.x < (left + length)) col = 0;
        else if (mouse.x < (left + (length * 2))) col = 1;
        else col = 2;

        if (board[row][col] == 0)
        {
            board[row][col] = 1;
            DrawX(col, row);
        }
    }

});

function DrawBoard()
{
    ctx.lineWidth = 5;
    ctx.beginPath();

    ctx.moveTo(cLength / 3, 0);
    ctx.lineTo(cLength / 3, cLength);
    ctx.stroke();

    ctx.moveTo(cLength * (2/3), 0);
    ctx.lineTo(cLength * (2/3), cLength);
    ctx.stroke();

    ctx.moveTo(0, cLength / 3);
    ctx.lineTo(cLength, cLength / 3);
    ctx.stroke();

    ctx.moveTo(0, cLength * (2/3));
    ctx.lineTo(cLength, cLength * (2/3));
    ctx.stroke();
}

function GameOver(result)
{
    gameOver = true;
    hdr.style.visibility = "visible";

    if (result == 'tie') hdr.innerText = "Tie!";
    else hdr.innerText = "Game over! " + result + " wins!";
}

function DrawCircle(x, y)
{
    let radius = Math.sqrt(cLength) * 3.3;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(x * length + (length / 2), y * length + (length / 2), radius, 0, Math.PI * 2, false);
    ctx.stroke();

    let result = CheckWin();
    if (result != null) GameOver(result);
    else playerTurn = true;
}

function DrawX(x, y)
{
    playerTurn = false;
    ctx.lineWidth = 8;

    ctx.beginPath();
    ctx.moveTo(length * x + (length / 5), length * y + (length / 5));
    ctx.lineTo(length * x + length - (length / 5), length * y + length - (length / 5));
    ctx.stroke();

    ctx.moveTo(length * x + length - (length / 5), length * y + (length / 5));
    ctx.lineTo(length * x + (length / 5), length * y + length - (length / 5));
    ctx.stroke();
    
    let result = CheckWin();
    if (result != null) GameOver(result);
    else ComputerTurn();
}

let scores = {
    X: -10,
    O: 11,
    tie: 0
};

function ComputerTurn()
{
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            if (board[i][j] == 0)
            {
                board[i][j] = 2;
                let score = minimax(0, false);
                board[i][j] = 0;
                if (score > bestScore) {
                    bestScore = score;
                    move = {i, j};
                }
            }
        }
    }

    board[move.i][move.j] = 2;
    DrawCircle(move.j, move.i);
}

function minimax(depth, isMaximizing)
{
    let result = CheckWin();
    if (result !== null) return scores[result];

    if (isMaximizing) // computer
    {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                if (board[i][j] == 0)
                {
                    board[i][j] = 2;
                    let score = minimax(depth + 1, false);
                    board[i][j] = 0;
                    if (score > bestScore) bestScore = score;
                }
            }
        }
        return bestScore;
    }
    else // human
    {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                if (board[i][j] == 0)
                {
                    board[i][j] = 1;
                    let score = minimax(depth + 1, true);
                    board[i][j] = 0;
                    if (score < bestScore) bestScore = score;
                }
            }
        }
        return bestScore; 
    }
}

function equal (a,b,c)
{
    return (a == b && b == c && a != 0);
}

function CheckWin()
{
    let winner = null;
    //horizontal
    for (let i = 0; i < 3; i++)
    {
        if (equal(board[i][0], board[i][1], board[i][2])) winner = board[i][0];
    }

    //vertical 
    for (let j = 0; j < 3; j++)
    {
        if (equal(board[0][j], board[1][j], board[2][j])) winner = board[0][j];
    }

    //diagonal
    if (equal(board[0][0], board[1][1], board[2][2])) winner = board[0][0];
    if (equal(board[0][2], board[1][1], board[2][0])) winner = board[0][2];

    let openSpots = 0;
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            if (board[i][j] == 0) openSpots ++;
        }
    }

    if (winner == 1) winner = "X";
    else if (winner == 2) winner = "O";

    if (winner == null && openSpots == 0) return 'tie';
    else return winner;
}

function restart()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hdr.innerText = "Game Over!";
    hdr.style.visibility = "hidden";
    board = [[0, 0, 0],
             [0, 0, 0],
             [0, 0, 0]];
    playerTurn = true;
    gameOver = false;
    DrawBoard();
}

window.onload = () => {
    DrawBoard();
}