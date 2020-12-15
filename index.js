const Player = (name, marker) =>{
	this.name = name;
	this.marker = marker;

	const getName = () => name;
	const getMarker = () => marker;
	
	return { getName, getMarker }	
}

const Gameboard = () =>{
	const gameboard = [];

	return gameboard;
}

function DisplayController(){
	
}