document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	const flagsLeft = document.querySelector('#flags-left');
	const result = document.querySelector('#result');
	// Initalize variables
	let width = 10;
	let duckCount = 20;
	let flags = 0;
	let squares = [];
	let gameEnded = false;

	// Create board
	function createBoard() {
		flagsLeft.innerHTML = duckCount;

		// Creates shuffled game array with random duck locations
		const ducksArray = Array(duckCount).fill('duck');
		const emptyArray = Array(width * width - duckCount).fill('valid');
		const gameArray = emptyArray.concat(ducksArray);
		const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

		for (let i = 0; i < width * width; i++) {
			const square = document.createElement('div');
			square.setAttribute('id', i);
			square.classList.add(shuffledArray[i]);
			grid.appendChild(square);
			squares.push(square);

			// Normal click
			square.addEventListener('click', function (e) {
				click(square);
			});

			// adding flag using control and left click
			square.oncontextmenu = function (e) {
				e.preventDefault();
				addFlag(square);
			};
		}

		// Adds numbers
		for (let i = 0; i < squares.length; i++) {
			let total = 0;
			const isLeftEdge = i % width === 0;
			const isRightEdge = i % width === width - 1;

			if (squares[i].classList.contains('valid')) {
				if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('duck')) total++;
				if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('duck'))
					total++;
				if (i > 10 && squares[i - width].classList.contains('duck')) total++;
				if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('duck'))
					total++;
				if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('duck')) total++;
				if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('duck'))
					total++;
				if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('duck'))
					total++;
				if (i < 89 && squares[i + width].classList.contains('duck')) total++;
				squares[i].setAttribute('data', total);
			}
		}
	}
	createBoard();

	// Allows user to add a flag with right click
	function addFlag(square) {
		if (gameEnded) return;
		if (!square.classList.contains('checked') && flags < duckCount) {
			if (!square.classList.contains('flag')) {
				square.classList.add('flag');
				square.innerHTML = ' 🚩';
				flags++;
				flagsLeft.innerHTML = duckCount - flags;
				checkForWin();
			} else {
				square.classList.remove('flag');
				square.innerHTML = '';
				flags--;
				flagsLeft.innerHTML = duckCount - flags;
			}
		}
	}

	// Allows user to click for actions
	function click(square) {
		let currentId = square.id;
		if (gameEnded) return;
		if (square.classList.contains('checked') || square.classList.contains('flag')) return;
		if (square.classList.contains('duck')) {
			gameOver(square);
		} else {
			let total = square.getAttribute('data');
			if (total != 0) {
				square.classList.add('checked');
				if (total == 1) square.classList.add('one');
				if (total == 2) square.classList.add('two');
				if (total == 3) square.classList.add('three');
				if (total == 4) square.classList.add('four');
				square.innerHTML = total;
				return;
			}
			checkSquare(square, currentId);
		}
		square.classList.add('checked');
	}

	// Checks neighboring squares
	function checkSquare(square, currentId) {
		const isLeftEdge = currentId % width === 0;
		const isRightEdge = currentId % width === width - 1;

		setTimeout(() => {
			if (currentId > 0 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > 9 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > 10) {
				const newId = squares[parseInt(currentId - width)].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > 11 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 98 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 90 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 88 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 89) {
				const newId = squares[parseInt(currentId) + width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
		}, 10);
	}

	// Game over function
	function gameOver(square) {
		result.innerHTML = 'Game Over! You hit a duck :(';
		gameEnded = true;

		// Shows all ducks
		squares.forEach((square) => {
			if (square.classList.contains('duck')) {
				square.innerHTML = '🐤';
				square.classList.remove('duck');
				square.classList.add('checked');
			}
		});
	}

	// Checks for win
	function checkForWin() {
		let matches = 0;

		for (let i = 0; i < squares.length; i++) {
			if (
				squares[i].classList.contains('flag') &&
				squares[i].classList.contains('duck')
			) {
				matches++;
			}
			if (matches === duckCount) {
				result.innerHTML = 'YOU WIN!!';
				gameEnded = true;
			}
		}
	}
});
