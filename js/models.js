const gameBoardBox = document.querySelector("#battlefield");

shotsTypes = {
    empty   : "white",
    missed  : "grey",
    injured : "orange",
    killed  : "red"
}

const randomNumber = (range) => {
    return Math.floor (Math.random() * (range - 1));
}

const isDead = (elem) => {
    elem.isFired;
}

// Cell stores cell info: id, Cell (x, y) and status 'shoted'
class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = `s${x}${y}`;
        this.isFired = false;
    }

}
// // Cell stores Cell info: x, y
// class Cell {
//     constructor (x, y, isFired = false) {
//         this.x = x;
//         this.y = y;
//         this.isFired = isFired;
//         this.isFired = false;
//     }
// }

// Ship stores ship's info
class Ship {
    constructor (id = 1, coordinates) {
        this.id = id;
        this.coordinates = coordinates;
    }
}

class Board {
    constructor (boats = [4,3,3,3,2,2,1,1]) {
        this.fieldHeight = 10;
        this.fieldWidth = 10;
        this.ships = [];
        this.ships_dead = 0;
        this.shipNumber = 4;
        this.cellWidgets = [];
        this.initCells();
        this.initShips(boats);
    }

    initCells = () => {
        for (let i = 0; i < this.fieldWidth; i++) {
            for (let j = 0; j < this.fieldHeight; j++) {
                let cell = new Cell(i, j);
                this.cellWidgets.push(cell);
            }
        }
    }

    initShips = (shipArray) => {
        let i = 1;
        shipArray.forEach((shipLength) => {
            this.placeShip(i, shipLength);
            i += 1;
        });
    }

    placeShip = (i, shipLength) => {
        let shipIsPlaced = false;
        while (!shipIsPlaced) {
            let isVertical = Math.random() > 0.5 ? true : false;
            let x = randomNumber(this.fieldWidth);
            let y = randomNumber(this.fieldHeight);

            if (isVertical) {
                while (y + shipLength >= this.fieldHeight) {
                    y = randomNumber(this.fieldHeight);
                }
            } else { //horizontal
                while (x + shipLength >= this.fieldWidth) {
                    x = randomNumber(this.fieldWidth);
                }
            }
            let isOtherShipsInArea = this.isShipsAround(x, y, isVertical, shipLength);

            if (!isOtherShipsInArea) {
                let coordinates = [];

                if (isVertical) {
                    for (let i = y; i < (y + shipLength); i++) {
                        coordinates.push(new Cell(x, i))
                    }
                } else { // horizontal
                    for (let i = x; i < (x + shipLength); i++) {
                        coordinates.push(new Cell(i, y));
                    }
                }

                // creating new ship, with id and coordinates: Cell.
                let newShip = new Ship(i, coordinates);

                this.ships.push(newShip);
                shipIsPlaced = true;
            }
        }
    }
    // check if any ships can be crossed by new around,
    isShipsAround = (xValue, yValue, isVertical, shipLength) => {

        let topLeftCell = new Cell(xValue - 1, yValue - 1);

        let bottomRightCell = null;
        if (isVertical) {
            bottomRightCell = new Cell(xValue + 1, yValue + shipLength);
        } else {
            bottomRightCell = new Cell(xValue + shipLength, yValue + 1);
        }

        let isShipExistInArea = false;

        for (let i = topLeftCell.x; i <= bottomRightCell.x; i++) {
            for (let j = topLeftCell.y; j <= bottomRightCell.y; j++) {
                this.ships.forEach((ship) => {
                    ship.coordinates.forEach((cellExisted) => {
                        if (j == cellExisted.y && i == cellExisted.x) {
                            isShipExistInArea = true;
                        }
                    });
                });
            }
        }
        return isShipExistInArea;
    }

    lightAllShips = () => {
        this.ships.forEach((ship) => {
            ship.coordinates.forEach((cell) => {
                let id = `s${cell.x}${cell.y}`;
                let targetCell = document.getElementById(`${id}`);
                targetCell.style.backgroundColor = 'green';
                
            });
        });
    }

    checkIfShipDead = (id) => {
        let dead = true;
        this.ships.forEach((ship) => {
            if (ship.id === id) {
                ship.coordinates.forEach((el) => {
                    if (el.isFired == false) {
                        dead = false;
                    }
                });
            }
        });
        console.log(dead);
        return dead;
    }

    shotHandler = (element) => {
        let color = "grey";

        let id = element.target.id;
        if (id == "battlefield") {
            return;
        }
        let logs = document.querySelector(`#log`);
        let targetCell = document.querySelector(`#${id}`);
        
        this.cellWidgets.forEach((cell) => {
            if (cell.id == id) {
                if (cell.isFired == true) {
                    alert("This field is already used");
                    return;
                }
                cell.isFired = true;
            }
        });
        let message = `Shooting to cell ${id}`; 
        let checkShipId = "";
        this.ships.forEach((ship) => {
            ship.coordinates.forEach((cell) => {
                if (id === `s${cell.x}${cell.y}`) {
                    
                    cell.isFired = true;
                    checkShipId = ship.id;
                    if (this.checkIfShipDead(checkShipId)) {
                        this.ships_dead += 1;
                        message += ` ship id ${ship.id} is dead!`;
                        this.ships.length == this.ships_dead && alert('All ships has been destroyed!');
                    } 
                    else {
                        message += ` ship injured!`;
                        color = "orange";
                    }
                }
            });
        });

        
        logs.value += `\n${message}`;
        if (targetCell === null) {
            return;
        }
        targetCell.style.backgroundColor = color;
        if (this.checkIfShipDead(checkShipId)) {
            this.paintShipRed(checkShipId);
        }

    }

    paintShipRed = (id) => {
        this.ships.forEach((ship) => {
            if (ship.id == id) {
                ship.coordinates.forEach((cell) => {
                    console.log(cell.id);
                    let targetCell = document.querySelector(`#${cell.id}`);
                    console.log(targetCell);
                    targetCell.style.backgroundColor = 'red';
                });
            }
        });  
    }
}