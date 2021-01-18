//factory function
const Player = (name, marker, type) =>{
	const getName = () => name;		//getter
	const getMarker = () => marker;	//getter
	const getType = () => type;

	return { getName, getMarker, getType};
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

		},
		updateStatus: (msg)=>{
			let status = document.getElementById('status');
			status.innerText = msg;
		}
	}
})('#gameboard')
//})('#gameboard').buildGrid(); //self invoked to build grids

//build dom gameboard
DisplayController.buildGrid(); 


//Module pattern function 
const GameControl = (()=>{

	const gamecells = document.querySelectorAll('#gameboard .cell');
	
	//board, players declaration
	console.log("init board");
	let	{ gameboard, getAvailableSpot } = Gameboard();
	let players =[];

	let p_loop = 0;

	//game start
	const init = ()=>{	

		let p1name = document.getElementById('player1name').value || "player1";
		let p2name = document.getElementById('player2name').value || "player2";

		DisplayController.writeToDom(document.getElementById('p1name'), p1name);
		DisplayController.writeToDom(document.getElementById('p2name'), p2name);

		let getPlayer1Type = document.querySelectorAll(".specs button.active")[0];
		let getPlayer2Type = document.querySelectorAll(".specs button.active")[1];

		console.log("created two players");		
		players.push(Player(p1name, 'X', getPlayer1Type.name));
		players.push(Player(p2name, 'O', getPlayer2Type.name));

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

		DisplayController.updateStatus(players[p_loop].getName() + '\'s turn');
		if(players[p_loop].getType() === 'ai'){	//ai turn;
			aiMove(p_loop);	
		}

	}

	//player_num to distinguish between player 1 ai or p2-ai
	const aiMove = (player_num)=>{	
		let bestMove, bestScore;	

		if(player_num === 0){
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

		let result = checkWinner();
		if(result==='X' || result ==='O'){
			disable_cell();
			
			DisplayController.updateStatus('Winner is:', players[p_loop].getName());
		}
		else if(result === 'tie'){
			disable_cell();
			DisplayController.updateStatus('Tie');
		}
		else{
			nextTurn();
		}
	}

	const utility_func = {
		'O': -10,
		'X': 10,
		'tie': 0
	}

	//const minimax = (position, depth, isMaxPlayer) =>{
	const minimax = (depth, isMaxPlayer, player_num) =>{
		let result = checkWinner();
			if(result !== null){	
			
				return utility_func[result];
		}

		if(isMaxPlayer){
			let maxEval= -10000;
			for(let i=0; i< getAvailableSpot.length; i++){

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
			for(let i=0; i < getAvailableSpot.length; i++){
				
				if(gameboard[i] === ""){
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
		
			let result = checkWinner();
			if(result==='X' || result ==='O'){
				disable_cell();
				DisplayController.updateStatus('Winner is:', players[p_loop].getName());
			}
			else if(result === 'tie'){
				disable_cell();
				DisplayController.updateStatus('Tied');
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

		//css class pointer-event: none to prevent clicking
		gamecells.forEach(node =>{
			node.classList.add('disable-div');
		});
	}

	const checkWinner = () =>{
	
		let winner = null;
	
		//winning scenario
		let wp = [ '012', '036', '048',	'147', '258', '246','345', '678'];
		
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
	
		//no winner decided, return tied game
		if(avail.length === 9 && winner == null){
			winner = 'tie';

			return winner;
		}
		
		return winner;

	}

	return { init }
})();



