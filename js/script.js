function AppViewModel(){
	var clientID = "DXJOXHELH1K44MFQUGUWKS2LDYW1FCIFV3YKXBVJSIKNTAZN";
	var clientSecret = "OFHCOKLL1KHDTB2F4YHNXV5RSQOWICRMQXLOTOXJTNRS2BSQ";


	var map;
	function initMap() {
	  map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 33.755, lng: -84.390},
	    zoom: 11
	  });	
	}

	google.maps.event.addDomListener(window, 'load', initMap);

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
    			//Populate map with markers
    			//for each venue in the JSON data between 0 and 10, create a 
    			//marker on the map and link to that venue's lat/long data.
    			var myLatlng = new google.maps.LatLng(33.755,-84.390);
    			var marker = new google.maps.Marker({
    				position: myLatlng,
    				title:"Hello World!"
				});
    			marker.setMap(map);
    			console.log(results);
    			var responseLength = results.response.groups[0].items.length;
    			console.log("response length is " + responseLength);
    			for(var i = 0; i < responseLength; i++){
    				console.log(results.response.groups[0].items[i].venue.location.lat);
    				console.log(results.response.groups[0].items[i].venue.location.lng);
    			}
    			

  			});
		
	}

}

//activates knockout.js
ko.applyBindings(new AppViewModel());

