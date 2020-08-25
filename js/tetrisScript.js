const Columns = 14;
const Rows = 20;
var Tetraminos = [];
var Cells = [];
var Score = 0;
var StopDrop = false;
var dead = false;
class Cell {
	constructor(column, row) {
		this.Column = column;
		this.Row = row;
	}
}
function AddkeyEvent() {
	window.onkeydown = function (e) {
		UpdateCells();
		if (!dead) {
			if (e.key == "ArrowRight") {
				Tetraminos[Tetraminos.length - 1].MoveRight(Cells);
			}
			if (e.key == "ArrowLeft") {
				Tetraminos[Tetraminos.length - 1].MoveLeft(Cells);
			}
			if (e.key == "ArrowUp") {
				Tetraminos[Tetraminos.length - 1].Rotate(Cells);
			}
			if (e.key == "ArrowDown") {
				Tetraminos[Tetraminos.length - 1].MoveDown(Cells);
			}
			if (e.key == " ") {
				StopDrop = false;
				for (var row = 0; row < Rows && !StopDrop; row++) {
					Tetraminos[Tetraminos.length - 1].MoveDown(Cells);
					UpdateCells();
				}
			}			
		}
		if (e.key == "r") {
			Restart();
		}
		drawParts();
	}
}
class Tetramino {
	constructor() {
		this.Cells = [];
		this.Disabled = false;
		this.Color = "red";
		this.OnStop = null;
		this.GetCollision = function (cells, cellsNew) {
			var moveDown = true;
			for (var index = 0; index < cells.length; index++) {
				var canCheck = true;
				for (var index2 = 0; index2 < this.Cells.length; index2++) {
					if (this.Cells[index2].Column == cells[index].Column) {
						if (this.Cells[index2].Row == cells[index].Row) {
							canCheck = false;
						}
					}
				}
				for (var index2 = 0; index2 < cellsNew.length; index2++) {
					if (cellsNew[index2].Column == cells[index].Column && canCheck) {
						if (cellsNew[index2].Row == cells[index].Row) {
							moveDown = false;
						}
					}
					if (cellsNew[index2].Row >= Rows) {
						moveDown = false;
					}
					if (cellsNew[index2].Column < 0) {
						moveDown = false;
					}
					if (cellsNew[index2].Column >= Columns) {
						moveDown = false;
					}
				}
			}
			return moveDown;
		};
		this.GetSize = function () {
			var minX = Number.MAX_VALUE;
			var minY = Number.MAX_VALUE;
			var maxX = Number.MIN_VALUE;
			var maxY = Number.MIN_VALUE;
			for (var index = 0; index < this.Cells.length; index++) {
				if (this.Cells[index].Column < minX) {
					minX = this.Cells[index].Column;
				}
				if (this.Cells[index].Row < minY) {
					minY = this.Cells[index].Row;
				}
				if (this.Cells[index].Column > maxX) {
					maxX = this.Cells[index].Column;
				}
				if (this.Cells[index].Row > maxY) {
					maxY = this.Cells[index].Row;
				}
			}
			return {
				Width: maxX - minX + 1,
				Height: maxY - minY + 1,
				X: minX,
				Y: minY
			}
		}
		this.Rotate = function (cells) {
			var cellsNew = [];
			var size = this.GetSize();
			if (this.Disabled) {
				return;
			}
			for (var index = 0; index < this.Cells.length; index++) {
				var ceil = Math.ceil(size.Width / 2);
				cellsNew.push(new Cell(-1 * (this.Cells[index].Row - size.Y) + size.X + ceil, (this.Cells[index].Column - size.X) * 1 + size.Y));
			}
			var rotate = this.GetCollision(cells, cellsNew);
			if (rotate) {
				this.Cells = cellsNew;
			}
		}
		this.MoveDown = function (cells) {
			var cellsNew = [];
			if (this.Disabled) {
				return;
			}
			for (var index = 0; index < this.Cells.length; index++) {
				cellsNew.push(new Cell(this.Cells[index].Column, this.Cells[index].Row + 1));
			}
			var moveDown = this.GetCollision(cells, cellsNew);
			if (moveDown) {
				this.Cells = cellsNew;
			}
			else {
				if (this.OnStop != null) {
					this.OnStop();
				}
				this.Disabled = true;
			}
		}
		this.MoveRight = function (cells) {
			var cellsNew = [];
			if (this.Disabled) {
				return;
			}
			for (var index = 0; index < this.Cells.length; index++) {
				cellsNew.push(new Cell(this.Cells[index].Column + 1, this.Cells[index].Row));
			}
			var moveRight = this.GetCollision(cells, cellsNew);
			if (moveRight) {
				this.Cells = cellsNew;
			}
		}
		this.MoveLeft = function (cells) {
			var cellsNew = [];
			if (this.Disabled) {
				return;
			}
			for (var index = 0; index < this.Cells.length; index++) {
				cellsNew.push(new Cell(this.Cells[index].Column - 1, this.Cells[index].Row));
			}
			var moveLeft = this.GetCollision(cells, cellsNew);
			if (moveLeft) {
				this.Cells = cellsNew;
			}
		}
	}
}
var TetraminoNow = new Tetramino();
function GetO() {
	var tetramino = new Tetramino();
	tetramino.Cells = [new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)];
	tetramino.Color = "yellow";
	return tetramino;
}
function GetJ() {
	var tetramino = new Tetramino();
	tetramino.Cells = [new Cell(1, 0), new Cell(1, 1), new Cell(1, 2), new Cell(0, 2)];
	tetramino.Color = "blue";
	return tetramino;
}
function GetI() {
	var tetramino = new Tetramino();
	tetramino.Cells = [new Cell(0, 0), new Cell(0, 1), new Cell(0, 2), new Cell(0, 3)];
	tetramino.Color = "aqua";
	return tetramino;
}
function GetL() {
	var tetramino = new Tetramino();
	tetramino.Cells = [new Cell(0, 0), new Cell(0, 1), new Cell(0, 2), new Cell(1, 2)];
	tetramino.Color = "orange";
	return tetramino;
}
function GetZ() {
	var tetramino = new Tetramino();
	tetramino.Cells = [new Cell(0, 0), new Cell(1, 0), new Cell(1, 1), new Cell(2, 1)];
	tetramino.Color = "red";
	return tetramino;
}
function GetT() {
	var tetramino = new Tetramino();
	tetramino.Cells = [new Cell(0, 1), new Cell(1, 1), new Cell(1, 2), new Cell(1, 0)];
	tetramino.Color = "purple";
	return tetramino;
}
function GetS() {
	var tetramino = new Tetramino();
	tetramino.Cells = [new Cell(0, 1), new Cell(1, 1), new Cell(1, 0), new Cell(2, 0)];
	tetramino.Color = "green";
	return tetramino;
}
function Init() {
	Tetraminos.push(TetraminoNow);
	TetraminoNow.Cells = [new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)];
	TetraminoNow.OnStop = AddRandomTetramino;
	TetraminoNow.Color = "yellow";
	Cells = TetraminoNow.Cells.slice();
}
function AddRandomTetramino() {
	var rand = Math.floor(Math.random() * 7);
	if (rand == 0) {
		TetraminoNow = GetO();
	}
	else if (rand == 1) {
		TetraminoNow = GetJ();
	}
	else if (rand == 2) {
		TetraminoNow = GetI();
	}
	else if (rand == 3) {
		TetraminoNow = GetL();
	}
	else if (rand == 4) {
		TetraminoNow = GetZ();
	}
	else if (rand == 5) {
		TetraminoNow = GetT();
	}
	else if (rand == 6) {
		TetraminoNow = GetS();
	}
	Tetraminos.push(TetraminoNow);
	TetraminoNow.OnStop = AddRandomTetramino;
	StopDrop = true;
}
function ClearCells() {
	var colsCleared = 0;
	UpdateCells();
	for (var row = 0; row < Rows; row++) {
		var clear = false;
		var filledCount = 0;
		for (var index = 0; index < Tetraminos.length; index++) {
			for (var index2 = 0; index2 < Tetraminos[index].Cells.length; index2++) {
				if (row == Tetraminos[index].Cells[index2].Row && Tetraminos[index].Disabled) {
					filledCount += 1;
				}
			}

		}
		if (filledCount >= Columns) {
			colsCleared += 1;
			clear = true;
		}
		if (clear) {
			for (var index = 0; index < Tetraminos.length; index++) {
				for (var index2 = 0; index2 < Tetraminos[index].Cells.length; index2++) {
					if (Tetraminos[index].Cells[index2].Row == row) {
						Tetraminos[index].Cells.splice(index2, 1);
						index2 -= 1;
					}
				}
			}
		}
		for (var index = 0; index < Tetraminos.length; index++) {
			for (var index2 = 0; index2 < Tetraminos[index].Cells.length; index2++) {
				if (Tetraminos[index].Cells[index2].Row < row && clear) {
					Tetraminos[index].Cells[index2].Row++;
				}
			}
		}
		if (clear) {
			UpdateCells();
		}
	}
	if (colsCleared == 0) {

	}
	else if (colsCleared == 1) {
		Score += 100;
	}
	else if (colsCleared == 2) {
		Score += 300;
	}
	else if (colsCleared == 3) {
		Score += 700;
	}
	else if (colsCleared == 4) {
		Score += 1500;
	}
}
function GameOver() {
	for (var index = 0; index < Tetraminos.length; index++) {
		for (var index2 = 0; index2 < Tetraminos[index].Cells.length; index2++) {
			if (Tetraminos[index].Cells[index2].Row == 0 && Tetraminos[index].Disabled) {
				dead = true;
			}
		}
	}	
}
function UpdateCells() {
	Cells.splice(0, Cells.length);
	for (var index = 0; index < Tetraminos.length; index++) {
		for (var index2 = 0; index2 < Tetraminos[index].Cells.length; index2++) {
			Cells.push(Tetraminos[index].Cells[index2]);
		}
	}
}