function AppViewModel(){

	//Data
	var clientID = "DXJOXHELH1K44MFQUGUWKS2LDYW1FCIFV3YKXBVJSIKNTAZN";
	var clientSecret = "OFHCOKLL1KHDTB2F4YHNXV5RSQOWICRMQXLOTOXJTNRS2BSQ";
	this.userSearch = ko.observable("Where?");
	var markers = [];
	var map;
	function initMap() {
	  map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 33.755, lng: -84.390},
	    zoom: 13
	  });	
	}
	google.maps.event.addDomListener(window, 'load', initMap);


	//Behavior
	this.searchFSquare = function(){
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
			//Populate map with markers
			//for each venue in the JSON data between 0 and 10, create a 
			//marker on the map and link to that venue's lat/long data.
			console.log(results);
			function createMarkers(results){
				var responseLength = results.response.groups[0].items.length;
				var lat;
				var lng;
				for(var i = 0; i < Math.min(15, responseLength); i++){
					lat = results.response.groups[0].items[i].venue.location.lat;
					lng = results.response.groups[0].items[i].venue.location.lng;
					//console.log(results.response.groups[0].items[i].tips[0].text);
					var myLatlng = new google.maps.LatLng(lat,lng);
	    			var marker = new google.maps.Marker({
	    				position: myLatlng,
	    				title:"Hello World!"
					});
					markers.push(marker);
				}
			}
			createMarkers(results);

			function setMapOnAll(map) {
			  for (var i = 0; i < markers.length; i++) {
			    markers[i].setMap(map);
			  }
			}
			setMapOnAll(map);

			//When the user clicks on a marker, show a tip about the venue in an InfoWindow.
			var infowindows = [];
			function createInfoWindows(map, results){
				var responseLength = results.response.groups[0].items.length;
				var infowindow = new google.maps.InfoWindow({content:'Hello!'});
				var i;
				for(i = 0; i < Math.min(15, responseLength); i++){
					var venueName = results.response.groups[0].items[i].venue.name;
					var tip = results.response.groups[0].items[i].tips[0].text;
					var phone = results.response.groups[0].items[i].venue.contact.phone;
					var contentString = '<h2>' + venueName + '</h2><p>' + tip + '</p>' + '<p>' + phone + '<p>';
					var infowindow = new google.maps.InfoWindow({
						content: contentString
					});
					infowindows.push(infowindow);
					
				}
				console.log(infowindows);
			}
			createInfoWindows(map, results);

			//Set event listeners for the InfoWindows to open upon the marker being clicked.
			function setInfoWindows(map, results){
				var responseLength = results.response.groups[0].items.length;
				for(var i = 0; i < Math.min(15, responseLength); i++){
					google.maps.event.addListener(markers[i], 'click', (function(i) {
        				return function() {
          					infowindows[i].open(map,markers[i]);
        				}
		      		})(i));
				}
			}
			setInfoWindows(map, results);

		});	
	}

}

//activates knockout.js
ko.applyBindings(new AppViewModel());

