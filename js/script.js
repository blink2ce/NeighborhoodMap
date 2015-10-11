function AppViewModel(){
	var clientID = "DXJOXHELH1K44MFQUGUWKS2LDYW1FCIFV3YKXBVJSIKNTAZN";
	var clientSecret = "OFHCOKLL1KHDTB2F4YHNXV5RSQOWICRMQXLOTOXJTNRS2BSQ";

	this.userSearch = ko.observable("Where?");
	this.searchFSquare = function(){
		alert(this.userSearch());
		var URL = "https://api.foursquare.com/v2/venues/explore?ll=33.755,-84.390&radius=5000&client_id=" + clientID + "&client_secret=" + clientSecret + "&query=" + this.userSearch()+ "&v=20160101";
		var info = $.ajax({
				type: 'GET',
				url: URL,
				dataType: 'json',
			})
			.fail(function() {
    			alert( "error" );
  			})
  			.done(function(results) {
    			alert( "success" );
    			console.log(results);
  			});
		
		//console.log(info.readyState);
		//console.log(info.progress);
		//console.log(URL);
		//console.log(info);
		//console.log(info.responseJSON);
		

		//console.log(this.userSearch);
	}
}


//activates knockout.js
ko.applyBindings(new AppViewModel());

