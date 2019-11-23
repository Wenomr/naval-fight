const gameBoardBox = document.querySelector("#battlefield");

shotsTypes = {
    empty   : "white",
    missed  : "grey",
    injured : "orange",
    killed  : "red"
}

function randomNumber(range) {
    return Math.floor (Math.random() * (range - 1));
}

// Cell stores cell info: id, position (x, y) and status 'shoted'
class Cell {
    constructor(pos, ship) {
        this.id = `s${pos.x}${pos.y}`;
        this.pos = pos;
        this.ship = ship;
        this.isFired = false;
    }

}
// Position stores position info: x, y
class Position {
    constructor (x, y, damaged = false) {
        this.x = x;
        this.y = y;
        this.damaged = damaged;
    }
}
// Ship stores ship's info
class Ship {
    constructor (id = 1, coordinates) {
        this.id = id;
        this.coordinates = coordinates;
    }
}

class Board {
    constructor () {
        this.fieldHeight = 10;
        this.fieldWidth = 10;
        this.ships = [];
        this.shipNumber = 4;
        this.cellWidgets = [];
        this.initCells();
        this.initShips([4,3,3,3,2,1,1]);
        
    }

    initCells = () => {
        for (let i = 0; i < this.fieldWidth; i++) {
            for (let j = 0; j < this.fieldHeight; j++) {
                let pos = new Position(i, j);
                let cell = new Cell(pos, null);
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
                        coordinates.push(new Position(x, i))
                    }
                } else { // horizontal
                    for (let i = x; i < (x + shipLength); i++) {
                        coordinates.push(new Position(i, y));
                    }
                }

                // creating new ship, with id and coordinates: Position.
                let newShip = new Ship(i, coordinates);

                this.ships.push(newShip);
                shipIsPlaced = true;
            }
        }
    }
    // check if any ships can be crossed by new ship
    isShipsAround = (xCoordinate, yCoordinate, isVertical, shipLength) => {

        let topLeftPos = new Position(xCoordinate - 1, yCoordinate - 1);

        let bottomRightPos = null;
        if (isVertical) {
            bottomRightPos = new Position(xCoordinate + 1, yCoordinate + shipLength);
        } else {
            bottomRightPos = new Position(xCoordinate + shipLength, yCoordinate + 1);
        }

        let isShipExistInArea = false;

        for (let i = topLeftPos.x; i <= bottomRightPos.x; i++) {
            for (let j = topLeftPos.y; j <= bottomRightPos.y; j++) {
                this.ships.forEach((ship) => {
                    ship.coordinates.forEach((posExisted) => {
                        if (j == posExisted.y && i == posExisted.x) {
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
            ship.coordinates.forEach((position) => {
                let id = `s${position.x}${position.y}`;
                let targetCell = document.getElementById(`${id}`);
                targetCell.style.backgroundColor = 'green';
            });
        });
    }
    // need a little more refactoring
    checkIfShipDead = (id) => {
        const cellIds = [];
        this.ships.forEach((ship) => {
            if (ship.id === id) {
                ship.coordinates.forEach((pos) => {
                    if (pos.damaged !== false) {
                        dead = false;
                        cellIds.push(`s${pos.x}${pos.y}`);
                        if (cellIds.length === ship.coordinates.length) {
                            cellIds.forEach((cellid) => {
                                let targetCell = document.getElementById(`${cellid}`);
                                if (targetCell !== null) {
                                    targetCell.style.backgroundColor = 'red';
                                }
                            });
                            let logs = document.querySelector(`#log`);
                            logs.value += `\nShip id: ${id}, with length of ${ship.coordinates.length} has been destroyed!`;
                        }
                    }
                });
            }
        });
    }

    shotHandler = (element) => {
        let id = element.toElement.id;
        let message = `Shooting to cell ${id}`; 
        let color = "grey";
        let checkShipId = "";
        this.ships.forEach((ship) => {
            ship.coordinates.forEach((pos) => {
                if (id === `s${pos.x}${pos.y}`) {
                    color = "orange";
                    pos.damaged = true;
                    checkShipId = ship.id;
                    message += ` ship injured!`;
                }
            });
        });
        let targetCell = document.querySelector(`#${id}`);
        let logs = document.querySelector(`#log`);
        logs.value += `\n${message}`;
        if (targetCell === null) {
            return;
        }
        targetCell.style.backgroundColor = color;
        this.checkIfShipDead(checkShipId);
    }
}