const board = new Board([5,4,3,3,3,2,2,1,1]);

// list boats with their sizes.

console.log(board);

board.cellWidgets.forEach((cell) => {
    // uses css grid to make field
    let square = document.createElement("div");
    // give each div element a unique id based on its row and column, like "s00"
    square.id = 's' + cell.x + cell.y;
    square.classList.add("square");
    
    gameBoardBox.appendChild(square);
});

document.querySelector("#battlefield")
    .addEventListener("click", board.shotHandler, false);

document.querySelector("#toggle-light-btn")
    .addEventListener("click", board.lightAllShips, false);

document.querySelector("#restart-btn")
    .addEventListener("click", () => location.reload(), false);
    