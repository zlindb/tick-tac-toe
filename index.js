//factory function
const Player = (name, marker) =>{
	
	const getName = () => name;		//getter
	const getMarker = () => marker;	//getter
	
	//shorthand
	return { getName, getMarker };
}

const Gameboard = () =>{
	let gameboard = [
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
		return;
			
	}
	const clearBoard = () =>{
		gameboard.length = 0;
		return;
	}
	return { getBoard, setBoard, clearBoard };
}

function displayController(selector, msg){
	document.querySelector(selector).innerHTML = msg;
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
		log("created two players");

		//create the board
		let gameboard = Gameboard();
		log("init board");

		return {player1, player2, gameboard}
	}

	const gamestart = () =>{
		console.log("gamecontrol start");
		let { player1, player2, gameboard } = init(); // initilize get 2 player and gameboard

		//move();
		//get turn
		
	}

	const log = msg => {
		console.log(msg);
	}

	const gameover = () =>{
		let gamestate = false;

		//if no winner is decide continue the game
		return gamestate;
	}
	//game over
	//restart
	return { gamestart, gameover, init, turn }
})();


