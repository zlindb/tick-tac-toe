//factory function
const Player = (name, marker, type) =>{
	const getName = () => name;		//getter
	const getMarker = () => marker;	//getter
	const getType = () => type;

	const move = (board, pos) =>{
	
		if(getType() === 'ai'){
			let ran = Math.floor(Math.random() * Math.floor(9)); 	//return # 1-8
			board[ran] = getMarker();	

		}
		else{
			
		//	gameboard.setBoard(pos, getMarker());
		}
	}
	
	return { getName, getMarker, getType, move};
}

const Gameboard = () =>{
	const gameboard = [
		'','','',
		'','','',
		'','',''
	];

	let availableSpot = ()=>{
		return gameboard.filter(val=> val ==='');
	};

	return { gameboard, getAvailableSpot: availableSpot() };
}

//object literal 
const DisplayController = ((selector = '#gameboard') => {

	return {
		board: document.querySelector(selector),
		createElement: (element, attr=['class', '']) => {
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
		},
		writeToDom: (selector, msg) =>{
			if(selector)
				selector.innerText = msg;
			else{
				console.error('selector is', selector);
			}

		}
	}
})('#gameboard')
//})('#gameboard').buildGrid(); //self invoked to build grids

//build dom gameboard
DisplayController.buildGrid(); 


//Module pattern function 
const GameControl = (()=>{

	const gamecells = document.querySelectorAll('#gameboard .cell');
	
	let p1name = document.getElementById('player1name').value || "player1";
	let p2name = document.getElementById('player2name').value || "player2";

	DisplayController.writeToDom(document.getElementById('p1name'), p1name);
	DisplayController.writeToDom(document.getElementById('p2name'), p2name);

	//board, players declaration
	console.log("init board");
	let	{ gameboard, getAvailableSpot } = Gameboard();

	console.log("created two players");		
	let players =[
			Player(p1name, 'X', 'human'),
			Player(p2name, 'O', 'ai')
		];

	let p_loop = 0;
/*
	const updateStatus = (msg) =>{
		let container = document.querySelector('#status');
		container.prepend(document.createTextNode(msg))
	}
*/
	//game start
	const init = ()=>{	

		//check if first move player is AI
		if(players[p_loop].getType() === 'ai'){
			aiMove();
		}
		//attach event listener
		for(let i = 0; i< gamecells.length; i++){
			gamecells[i].addEventListener('click', eventListener);
		}

	}
	const nextTurn = () =>{
		p_loop = (p_loop+1) % players.length;

		if(players[p_loop].getType() === 'ai'){	//ai turn;
			aiMove();	
		}		
	}

	const aiMove = ()=>{	
	let bestMove, bestScore;	

	if(players[0].getType() === 'ai'){
		bestScore = -10000;
		bestMove = 0;
		for(let i = 0; i< getAvailableSpot.length;i++){
			if(gameboard[i] === ""){
				gameboard[i] = players[p_loop].getMarker();
				let score = minimax(0, false);
				gameboard[i] = '';
				if(score > bestScore){
					bestScore = score;
					bestMove = i;
				}
			}
		}	
	}
	else {
		bestScore = 10000;
		bestMove = 0;
		for(let i = 0; i< getAvailableSpot.length;i++){
			if(gameboard[i] === ""){
				gameboard[i] = players[p_loop].getMarker();
				let score = minimax(0, true);
				gameboard[i] = '';
				if(score < bestScore){
					bestScore = score;
					bestMove = i;
				}
			}
		}
		
		
	}

	//	gameboard.setBoard(available[random], playerArr[p_loop].getMarker());	
	//	DisplayController.writeToDom(gamecells[available[random]], playerArr[p_loop].getMarker());
		gameboard[bestMove] = players[p_loop].getMarker();	
		DisplayController.writeToDom(gamecells[bestMove], players[p_loop].getMarker());

		if(checkWinner() !== null){
			disable_cell();
			//console.log('Winner: ' + playerArr[p_loop].getName());
		//	console.log('Winner: ' + result);
			return;
		}
		else{
			nextTurn();
		}
	}

	const utility_func = {
		'O': -1,
		'X': 1,
		'tie': 0
	}

	//const minimax = (position, depth, isMaxPlayer) =>{
	const minimax = (depth, isMaxPlayer) =>{
		let result = checkWinner();
			if(result !== null){	
			
				return utility_func[result];
		}

		if(isMaxPlayer){
			let maxEval= -10000;
			for(let i=0; i< gameboard.length; i++){

				if(gameboard[i] === ""){
					
					gameboard[i] = players[0].getMarker();					
					let score = minimax(depth+1, false);

					gameboard[i] = '';
					
					maxEval = Math.max(maxEval, score);
				}		
			}

			return maxEval;		
		}
	
		else{ //min player
			let minEval = 10000;
			for(let i=0; i < gameboard.length; i++){
				
				if(gameboard[i] === ""){
				//	p_loop = (p_loop+1) % players.length;// get the other player

					gameboard[i] = players[1].getMarker();

					let score = minimax(depth+1, true);
					
					gameboard[i] = '';	
					minEval = Math.min(minEval, score);			

				}	
			}
			return minEval;
		}

	}

	//event Listener for human playe
	const eventListener = (e) =>{	
		if(event.target.innerText === ''){
			let index = Array.prototype.indexOf.call(gamecells, e.target); 
			gameboard[index] = players[p_loop].getMarker();
			DisplayController.writeToDom(e.target, players[p_loop].getMarker());
		
			if(checkWinner() !== null){
				disable_cell();
				console.log("winner ", players[p_loop].getName());
			}
			else{
				nextTurn();
			}
		}
	}

	const disable_cell = () => {
		//remove all event listener to stop progress
		/*gamecells.forEach(node=>{
			node.removeEventListener(type, func, false);
		});*/

		gamecells.forEach(node =>{
			node.classList.add('disable-div');
		});
	}

	const checkWinner = () =>{
	
		let winner = null;
	
		//winning scenario
		let wp = [ '012', '036', '048',	'147', '258', '246','345', '678'];

		//if there's less 3 marks, skip checks //filter array to ignore empty values
		// if(gameboard.getBoard().filter(function(val){
		// 	if(!val) return false;
		// 	return val;
		// }).length < 3) return false;
		
		for(let i = 0; i< wp.length; i++){
			let e = wp[i];

			let win = gameboard[e[0]] + gameboard[e[1]] +gameboard[e[2]];

			if(win === 'XXX'){

				return 'X';
			}
			else if(win ==='OOO'){
				return 'O';
			}
			
		}
		let avail = gameboard.filter(val =>{
			return val !== '';
		});
	//	console.log(avail);
		//no winner decided, return tied game
		if(avail.length === 9 && winner == null){
			winner = 'tie';
			return winner;
		}
		
		return winner;

	}

	return { init , gameboard }
})();



