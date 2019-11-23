const board = new Board();

console.log(board);

board.cellWidgets.forEach((cell) => {

    let square = document.createElement("div");

    // give each div element a unique id based on its row and column, like "s00"
    square.id = 's' + cell.pos.x + cell.pos.y;
    square.classList.add("square");
    
    gameBoardBox.appendChild(square);
});

//board.lightAllShips();

document.querySelector("#battlefield").addEventListener("click", board.shotHandler, false);