var state = {
    over: false,
    turn: 'b',
    board:[
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, "w", "b", null, null, null],
        [null, null, null, "b", "w", null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]],
    location: { x: 0, y: 0 },
};

var ctx;


function checkForEnd(play)
{
    state.over = true;
    var white = 0, black = 0;
    for (var y = 0; y < 8; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            if (state.board[y][x] == "w")
            {
                white++;
                continue;
            }
            if (state.board[y][x] == "b")
            {
                black++;
                continue;
            }
            if (getMoves(x, y).length > 0) state.over = false;
        }
    }
    renderBoard();
    if (!play)
    {
        if (white > black)
            alert("White wins " + white + " - " + black);
        else
        if (white < black)
            alert("Black wins " + black + " - " + white);
        else
            alert("Draw " + black + " - " + white)
    }
    return state.over;
}

function nextTurn()
{
    if (state.turn === 'b') state.turn = 'w';
    else state.turn = 'b';
}

function getFillStyle()
{
    if (state.turn == "w") return "#fff";
    return "#000"
}

function getOtherColor()
{
    if (state.turn == "w") return "b";
    return "w"
}

function checkDirection(x, y, dir)
{
    var op = getOtherColor();
    var pl = state.turn;
    var pathLength = 0;
    var foundOpponent = false;
    function checkPath()
    {
        if (foundOpponent)
        {
            if (!state.board[ny][nx]) return 0;
            if (state.board[ny][nx] == op) pathLength++;
            if (state.board[ny][nx] == pl) return pathLength;
        }
        else
        {
            if (!state.board[ny][nx] || state.board[ny][nx] == pl) return 0;
            if (state.board[ny][nx] == op)
            {
                foundOpponent = true;
                pathLength++;
            }
        }
    }
    var ret, nx, ny;

    switch (dir)
    {
        case 0:
            for (ny = y - 1, nx = x; ny > -1; ny--)
            {
                if ((ret = checkPath()) != undefined) return ret;
            }
            break;
        case 1:
            for (ny = y - 1, nx = x + 1; ny > -1 && nx < 8; ny-- , nx++)
            {
                if ((ret = checkPath()) != undefined) return ret;
            }
            break;
        case 2:
            for (ny = y, nx = x + 1; ny > -1 && nx < 8; nx++)
            {
                if ((ret = checkPath()) != undefined) return ret;
            }
            break;
        case 3:
            for (ny = y + 1, nx = x + 1; ny < 8 && nx < 8; ny++ , nx++)
            {
                if ((ret = checkPath()) != undefined) return ret;
            }
            break;
        case 4:
            for (ny = y + 1, nx = x; ny < 8 && nx < 8; ny++)
            {
                if ((ret = checkPath()) != undefined) return ret;
            }
            break;
        case 5:
            for (ny = y + 1, nx = x - 1; ny < 8 && nx > -1; ny++ , nx--)
            {
                if ((ret = checkPath()) != undefined) return ret;
            }
            break;
        case 6:
            for (ny = y, nx = x - 1; ny < 8 && nx > -1; nx--)
            {
                if ((ret = checkPath()) != undefined) return ret;
            }
            break;
        case 7:
            for (ny = y - 1, nx = x - 1; ny > -1 && nx > -1; ny-- , nx--)
            {
                if ((ret = checkPath()) != undefined) return ret;
            }
            break;
            return 0;
    }
}

function getMoves(x, y)
{
    var paths = [];
    for (var i = 0; i < 8; i++)
    {
        var dirPath = checkDirection(x, y, i);
        if (dirPath > 0)
        {
            paths.push({ dir: i, length: dirPath });
        }
    }
    return paths;
}




function handleClick(event)
{
    var x = state.location.x;
    var y = state.location.y;
    renderBoard();
    if (!state.board[y][x]) {
        var moves = getMoves(x, y);
        if (moves.length == 0) return renderBoard();
        moves.forEach(function (move) {
            applyMove(x, y, move.dir, move.length);
        });
        nextTurn();
        if (checkForEnd(true))
        {
            nextTurn();
            checkForEnd(false)
        }
        renderBoard();
    }
}


function handleHover(event)
{
    if (!ctx) return;
    var x = Math.floor(event.clientX / 100);
    var y = Math.floor(event.clientY / 100);
    if (state.location.x == x && state.location.y == y) return;
    if (x < 0 || y < 0 || y > 7 || x > 7) return;
    state.location.x = x;
    state.location.y = y;
    renderBoard();
    if (!state.board[y][x]) {
        var moves = getMoves(x, y);
        if (moves.length == 0) return renderBoard();
        renderBoard();
        moves.forEach(function (move) {
            renderMove(x, y, move.dir, move.length);
        });
    }
}

function renderBoard()
{
    for (var y = 0; y < 8; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            ctx.fillStyle = "#123456";
            ctx.strokeStyle = "000";
            ctx.fillRect(x * 100, y * 100, 100, 100);
            ctx.strokeRect(x * 100, y * 100, 100, 100);
            if (state.board[y][x])
            {
                switch (state.board[y][x])
                {
                    case "b":
                        ctx.beginPath();
                        ctx.fillStyle = "#000";
                        ctx.arc(x * 100 + 50, y * 100 + 50, 40, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case "w":
                        ctx.beginPath();
                        ctx.fillStyle = "#fff";
                        ctx.arc(x * 100 + 50, y * 100 + 50, 40, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                }
            }
        }       
    }
    ctx.fillStyle = getFillStyle();
    ctx.fillRect(0, 800, 800, 100);
}



function drawPath(x, y)
{
    ctx.fillStyle = "rgba(0, 125, 0, 0.25)";
    ctx.fillRect(x * 100, y * 100, 100, 100);
}



function renderMove(x, y, dir, length)
{
    var path = getPathCords(x, y, dir, length);
    path.forEach(function (square)
    {
        drawPath(square.x, square.y);
    })
}



function getPathCords(x, y, dir, length)
{
    var path = [];
    var lengthLimit = -2, nx, ny;
    switch (dir)
    {
        case 0:
            for (ny = y, nx = x; lengthLimit < length && (ny > -1); ny-- , lengthLimit++)
            {
                path.push({ x: nx, y: ny });
            }
            break;
        case 1:
            for (ny = y, nx = x; lengthLimit < length && (ny > -1 || nx < 8); ny-- , nx++ , lengthLimit++)
            {
                path.push({ x: nx, y: ny });
            }
            break;
        case 2:
            for (ny = y, nx = x; lengthLimit < length && (ny > -1 || nx < 8); nx++ , lengthLimit++)
            {
                path.push({ x: nx, y: ny });
            }
            break;
        case 3:
            for (ny = y, nx = x; lengthLimit < length && (ny < 8 || nx < 8); ny++ , nx++ , lengthLimit++)
            {
                path.push({ x: nx, y: ny });
            }
            break;
        case 4:
            for (ny = y, nx = x; lengthLimit < length && (ny < 8 || nx < 8); ny++ , lengthLimit++)
            {
                path.push({ x: nx, y: ny });
            }
            break;
        case 5:
            for (ny = y, nx = x; lengthLimit < length && (ny < 8 || nx > -1); ny++ , nx-- , lengthLimit++)
            {
                path.push({ x: nx, y: ny });
            }
            break;
        case 6:
            for (ny = y, nx = x; lengthLimit < length && (ny < 8 || nx > -1); nx-- , lengthLimit++)
            {
                path.push({ x: nx, y: ny });
            }
            break;
        case 7:
            for (ny = y, nx = x; lengthLimit < length && (ny > -1 || nx > -1); ny-- , nx-- , lengthLimit++)
            {
                path.push({ x: nx, y: ny });
            }
            break;
    }
    return path;
}

function applyMove(x, y, dir, length)
{
    var path = getPathCords(x, y, dir, length);
    if (path.length == 0) return;
    for (var i = 0; i < path.length; i++) {
        state.board[path[i].y][path[i].x] = state.turn;
    }
    return renderBoard();
}




function setup()
{
    var canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 900;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    canvas.onmousemove = handleHover;
    canvas.onclick = handleClick;
    renderBoard();
}
setup();
