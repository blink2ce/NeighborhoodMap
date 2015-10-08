function AppViewModel(){
	var clientID = "DXJOXHELH1K44MFQUGUWKS2LDYW1FCIFV3YKXBVJSIKNTAZN";
	var clientSecret = "OFHCOKLL1KHDTB2F4YHNXV5RSQOWICRMQXLOTOXJTNRS2BSQ";

	this.placequery = ko.observable("Where?");
	this.searchFSquare = function(){
		var URL = "https://api.foursquare.com/v2/venues/explore?offset=0&limit=50&section=coffee&query=Starbucks&ll=38.0,-78.5&radius=40233.60&client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20121215";
		var info = $.ajax({
				type: 'GET',
				url: URL,
				dataType: 'json',
		});
		
		console.log(info.readyState);
		console.log(info.progress);
		console.log(info);
	}
}


//activates knockout.js
ko.applyBindings(new AppViewModel());

