//factory function
const Player = (name, marker, type) =>{
	const getName = () => name;		//getter
	const getMarker = () => marker;	//getter
	const getType = () => type;

	const move = (board, pos) =>{
	
		if(getType() === 'ai'){
			let ran = Math.floor(Math.random() * Math.floor(9)); 	//return # 1-8
			board.setBoard(ran, getMarker());	

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

	const getBoard = () => gameboard;
	const setBoard = (pos, marker) =>{
		if(typeof(marker) !== "string"){
			console.error("not a string");
			return;
		}
		//check if value is either X or O
		if(marker.toUpperCase() === 'X' || marker.toUpperCase() === 'O'){
			gameboard[pos] = marker.toUpperCase();		
		}			
	}

	const clearBoard = () =>{
		gameboard.length = 0;
	}

	return { getBoard, setBoard, clearBoard };
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
			selector.innerHTML = msg;
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
	let	gameboard = Gameboard();

	console.log("created two players");		
	let playerArr =[
			Player(p1name, 'X', 'ai'),
			Player(p2name, 'O', 'human')
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

		//check if player is AI
		if(playerArr[p_loop].getType() === 'ai'){
			aiMove();
			nextTurn();	
		}
		//attach event listener
		for(let i = 0; i< gamecells.length; i++){
			gamecells[i].addEventListener('click', eventListener);
		}

	}
	const nextTurn = () =>{
		p_loop = (p_loop+1) % playerArr.length;

		if(playerArr[p_loop].getType() === 'ai'){	//ai turn;
			aiMove();

			if(checkWinner() === 'true'){
				disable_cell();
				console.log('Winner: ' + playerArr[p_loop].getName());
				return;
			}
			else if(checkWinner() === 'tied'){
				disable_cell();
				console.log('tied');
				return;
			}
		
			else{
				nextTurn();
			}
		}		
	}

	//get the available spot in gamboard
	const availableIndex = () =>{
		let available = [];	
		gameboard.getBoard().forEach((val,index)=>{
			if(val === '') available.push(index);
		});
		let random = Math.floor(Math.random() * available.length);	
		return available[random];
	}

	const aiMove = ()=>{
		let index = availableIndex();
		let bestMove;
		let bestscore = -1000000;

		//if(gameboard.getBoard(index) === ""){
		/*	
			let score = minimax(gameboard.getBoard(), 0, true);
			console.log(score);
			if(score > bestscore){
				bestscore = score;
				bestMove = index;
			}
*/
		//	console.log(bestMove);

			gameboard.setBoard(index, playerArr[p_loop].getMarker());	
			DisplayController.writeToDom(gamecells[index], playerArr[p_loop].getMarker());

		//	gameboard.setBoard(bestMove, playerArr[p_loop].getMarker());	
		//	DisplayController.writeToDom(gamecells[bestMove], playerArr[p_loop].getMarker());
		//}

	}

	const eval_func = {
		'true': 10,
		'false': -10,
		'tied': 0
	}
	//const minimax = (position, depth, isMaxPlayer) =>{
	const minimax = (board, depth, isMaxPlayer) =>{
		let result = checkWinner();
		if(result !== 'false'){	
			console.log("result", result);
			return eval_func[result];
		}
		console.log(board);
		if(isMaxPlayer){
			let maxScore = -Infinity;
			for(let i=0; i< board.length; i++){
				if(board[i] === ""){

					board[i] = playerArr[0].getMarker();
					let score = minimax(board, depth+1, false);
					//what does the score return?
					//what is the value function?

					board.setBoard(i, '');

					maxScore = Math.max(maxScore, score);
					
				}
				
			}
			return maxScore;		
		}
		else{ //min player
			let maxScore = Infinity;
			for(let i=0; i< board.length; i++){
				if(board[i] === ""){

					board[i] = playerArr[1].getMarker();
					let score = minimax(board, depth+1, true);
					board.setBoard(i, '');

					maxScore = Math.min(score, maxScore);
					
				}
				
			}
			
			return maxScore;
		}

		return 1;
	}

	//event Listener for human player
	const eventListener = (e) =>{	
		if(event.target.innerText === ''){

			gameboard.setBoard(Array.prototype.indexOf.call(gamecells, e.target), playerArr[p_loop].getMarker());
			DisplayController.writeToDom(e.target, playerArr[p_loop].getMarker());
		
			if(checkWinner() === 'true'){
				disable_cell();
				console.log("winner ", playerArr[p_loop].getName());

			}
			else if(checkWinner() === 'tied'){
				disable_cell();
				console.log('game tied');
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
	
		let winner = 'false';
	
		//winning scenario
		let wp = [ '012', '036', '048',	'147', '258', '246','345', '678'];

		//if there's less 3 marks, skip checks //filter array to ignore empty values
		// if(gameboard.getBoard().filter(function(val){
		// 	if(!val) return false;
		// 	return val;
		// }).length < 3) return false;
		
		for(let i = 0; i< wp.length; i++){
			let e = wp[i];

			let win = gameboard.getBoard()[e[0]] + gameboard.getBoard()[e[1]] +gameboard.getBoard()[e[2]];

			if(win === 'XXX' || win === 'OOO'){
				winner = 'true';	
			//	console.log("winner is: ", playerArr[p_loop].getName());

				return winner;
			}
			
		}
		//no winner decided, return tied game
		if(gameboard.getBoard().filter(function(val){
			if(!val) return false;
			return val;
		}).length === 9 && winner == 'false'){
			return 'tied';
		}
		return 'false';
	}

	return { init }
})();


