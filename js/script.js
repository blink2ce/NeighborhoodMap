function AppViewModel(){
	this.placequery = ko.observable("Where?");
	this.searchFSquare = function(){
		console.log("I ran!");
	}
}


//activates knockout.js
ko.applyBindings(new AppViewModel());

