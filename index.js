//factory function
const Player = (name, marker) =>{
	const getName = () => name;		//getter
	const getMarker = () => marker;	//getter
	//shorthand
	const turn = false;
	
	return { getName, getMarker, turn };
}

const Gameboard = () =>{
	const gameboard = [];

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

//object literal 
const DisplayController = (selector = '#gameboard') => {

	return {
		board: document.querySelector(selector),
		createElement: (element, attr) => {
			let ele = document.createElement(element)
			ele.setAttribute(attr[0], attr[1]);
			return ele;
		},
		buildGrid: function(size = 3){ 
			for(let r =0; r< size; r++){
				let cellrow = this.createElement('div', ['class', 'cellrow']);	
				for(let c =0; c< size; c++){
					let cell = this.createElement('div', ['class','cell']);	
					//cell.innerHTML = c;
					cellrow.appendChild(cell);

				}
				this.board.appendChild(cellrow) //append to gameboard
			}
		}
		

	}
}

//Module pattern function 
const GameControl = (()=>{
//	let turn = true;
	let p_loop = 0;
	
	const writeToDom = function(selector, msg){
		selector.innerHTML = msg;
	}
	//game start
	const init = ()=>{
		
		//build dom gameboard
		DisplayController('#gameboard').buildGrid(); 

		//create the board
		let gameboard = Gameboard();
		console.log("init board");

		//creating the players
		let player1 = Player('player1', 'X');
		let player2 = Player('player2', 'O');
	//	let player3 = Player('player3', 'Z');
	//	let player4 = Player('player4', 'W');

		console.log("created two players");

		//specific which player to take first turn
		player1.turn = true;

		//start the game by passing in players, and board
		gamestart(gameboard, [player1, player2]);
	
	}
	
	//Multiple player turn control, can work more than 2
	//@param players - Array Objects of all player created
	//@param firstturn - player object who's taking the first turn
	const turnControl = (players)=>{

		let currentPlayer = '';

		if(players[p_loop].turn === true){
			
			currentPlayer = players[p_loop];
			
			//turn off current player turn
			currentPlayer.turn = !currentPlayer.turn; 

			//next turn
			p_loop++;

			//if next player does not exist (out of bound)
			if(!players[p_loop]){
				//set next player to player 1
				p_loop = 0; 
				players[p_loop].turn = !players[p_loop].turn;		
			}
			else{			
				//set next player turn to true
				players[p_loop].turn = !players[p_loop].turn;
			}
		}
		console.log("current player: ", currentPlayer);
		return currentPlayer;		
	}


	const gamestart = (gameboard, players, callback) =>{
		//let { player1, player2, gameboard } = init();
		let cells = document.querySelectorAll('#gameboard .cell');	
		
		for(let i = 0; i< cells.length; i++){
			cells[i].addEventListener('click', function flow(e) {
			
				//cell already clicked, do nothing
				if(this.innerText !== ''){
					//this.removeEventListener(e.type, flow, false ); //remove listener
					return;
				}
			
				//if(turn == true) {	

				let player_turn = turnControl(players);
				console.log('who: ' + player_turn.getName());


				//update the dom
				//this.innerText = player1.getMarker();
				//e.target.innerText = player1.getMarker();
				writeToDom(e.target, player_turn.getMarker());

				//update the board
				//console.log(Array.prototype.indexOf.call(cells, this))

				//use call method to use indexOf from array to get cells
				gameboard.setBoard(Array.prototype.indexOf.call(cells, this), player_turn.getMarker());

				if(gameover(gameboard.getBoard()) === true){
					//pass in callback function to update the dom
					//and clear up the board
					console.log('winner p1');
				}	
		
				console.log('onclick: cell# '+i+ " cellval " + gameboard.getBoard()[i]);	
			}, false);

		}
		//move();
		//get turn
	}

	const gameover = (gameboard) =>{
		//no checks when there's less than 3 marks
		let winner = false;

		//value are 1 less than actual number pattern
		//winning scenario
		let wp = [ 
			'012', '036', '048',
			'147', '258', '246',
			'345', '678'
		];

		//if there's less 3 marks, skip checks
		//filter array to ignore empty values
		if(gameboard.filter(function(val){
			if(!val) return false;
			return val;
		}).length < 3) return;
		//winning_pattern.forEach(function(e){
		for(let i = 0; i< wp.length; i++){
			//gameboard.getBoard(); //get all the board value
			//check for winning condition
			//e.toString()[0]
			let e = wp[i];
			let win = gameboard[e[0]] + gameboard[e[1]] +gameboard[e[2]];

			if(win === 'XXX' || win === 'OOO'){
				winner = true;
				return winner;
			}
		}
		
		//no winner decided, return tied game
		if(gameboard.filter(function(val){
			if(!val) return false;
			return val;
		}).length === 9 && winner == false){
			console.log('game tied')
		}
		
		return winner;
	}
	return { gamestart, gameover, init }
})();

