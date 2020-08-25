const ctx = canv.getContext('2d')
const boardWidth = 20
const side = Math.floor(canv.height / boardWidth)

scoreCountSpan.innerText = localStorage.score || 0

const game = {
	score: localStorage.score || 0,
	tick: 500,
	parts: [
		[
			[2, 2],
			[2, 3],
			[2, 4],
			[1, 2]
		]
	]
}

function Restart() {
	dead = false;
	Tetraminos.splice(0, Tetraminos.length);
	TetraminoNow = new Tetramino();
	TetraminoNow.Disabled = false;
	Init();
	UpdateCells();	
}

function drawChessboard() {
	let color = '#fafafa'
	for (let i = 0; i < boardWidth; i++) {
		color = color == '#fafafa' ? '#eee' : '#fafafa'
		ctx.fillStyle = color
		for (let j = 0; j < boardWidth; j++) {
			color = color == '#fafafa' ? '#eee' : '#fafafa'
			ctx.fillStyle = color
			ctx.fillRect(i * side, j * side + 5, side, side)
		}
	}
}

function drawParts() {
	ctx.clearRect(0, 0, canv.width, canv.height);
	UpdateCells();
	drawChessboard()	

	for (var index = 0; index < Tetraminos.length; index++) {
		for (var index2 = 0; index2 < Tetraminos[index].Cells.length; index2++) {
			ctx.fillStyle = Tetraminos[index].Color;
			var x = Tetraminos[index].Cells[index2].Column * side;
			var y = Tetraminos[index].Cells[index2].Row * side + 5;
			ctx.fillRect(x, y, side, side);
		}
	}
}

function tick() {	
	localStorage.score = Score;
	scoreCountSpan.innerText = Score;
	if (!dead) {
		Tetraminos[Tetraminos.length - 1].MoveDown(Cells);
		UpdateCells();
		ClearCells();
		GameOver();
	}
	drawParts();
}
