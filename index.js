//factory function
const Player = (name, marker) =>{
	const getName = () => name;		//getter
	const getMarker = () => marker;	//getter
	//shorthand
	return { getName, getMarker };
}

const Gameboard = () =>{
	const gameboard = [
	'','','',
	'','','',
	'','',''
	];

	const getBoard = () => gameboard;
	const setBoard = (pos, val) =>{
		if(typeof(val) !== "string"){
			console.error("not a string");
			return;
		}
		//check if value is either X or O
		if(val.toUpperCase() === 'X' || val.toUpperCase() === 'O'){
			gameboard[pos] = val.toUpperCase();		

		}
			
	}
	const clearBoard = () =>{
		gameboard.length = 0;
		return;
	}

	return { getBoard, setBoard, clearBoard };
}

function displayController(event){
	//document.querySelector(selector).innerHTML = msg;
	//functions for addEventListener
	//check which player
	//display mark in cell X or O on click
}

//this function control the gamestate
const GameControl = (()=>{
	let turn = true;
	//game start
	const init = ()=>{
		//creating the players
		let player1 = Player('player1', 'X');
		let player2 = Player('player2', 'O');
		console.log("created two players");

		//create the board
		let gameboard = Gameboard();
		console.log("init board");

		return {player1, player2, gameboard }
	}

	const gamestart = () =>{
		console.log("gamecontrol start");
		let { player1, player2, gameboard } = init(); // initilize get 2 player and gameboard

		//move();
		//get turn
		
	}

	const gameover = (gameboard) =>{
		
		let winner = false;
		//value are 1 less than actual number pattern
		let wp = [ 
			'012', '036', '048',
			'147', '258', '246',
			'345', '678'
		];
		
		//winning_pattern.forEach(function(e){
		for(let i = 0; i< wp.length; i++){
			//gameboard.getBoard(); //get all the board value
			//check for winning condition
			//e.toString()[0]
			let e = wp[i];
			let win = gameboard[e[0]] + gameboard[e[1]] +gameboard[e[2]];

			if(win === 'XXX' || win === 'OOO'){
				winner = true;
				break;
			}
		}
		
		return winner;
	}
	//game over
	//restart
	return { gamestart, gameover, init, turn }
})();


