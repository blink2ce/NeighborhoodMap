function AppViewModel(){
	var self = this;
	//DATA
	var clientID = "DXJOXHELH1K44MFQUGUWKS2LDYW1FCIFV3YKXBVJSIKNTAZN";
	var clientSecret = "OFHCOKLL1KHDTB2F4YHNXV5RSQOWICRMQXLOTOXJTNRS2BSQ";
	self.userSearch = ko.observable();
	self.errorMessage = ko.observable();
	self.myLocations = ko.observableArray([]);
	self.filterArea = ko.observable(false);
	self.filter = ko.observable(false);
	self.filterSearch = ko.observable();
	var markers = [];
	var bouncingMarker = null;
	var infoWindow = new google.maps.InfoWindow();
	var map;
	var results;
	//Create the map and set the location
	function initMap() {
	  map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 33.755, lng: -84.390},
	    zoom: 13
	  });	
	}
	google.maps.event.addDomListener(window, 'load', initMap);
	//Center map if window is resized
	google.maps.event.addDomListener(window, "resize", function() {
    	var center = map.getCenter();
    	google.maps.event.trigger(map, "resize");
    	map.setCenter(center);
	});

	//BEHAVIOR

	//Put markers on map
	function setMapOnAll(map) {
	  for (var i = 0; i < markers.length; i++) {
	    markers[i].setMap(map);
	  }
	}

	//Filter the results in the side window using a keyword to filter against. Runs when the filter button is clicked.
	self.filterResults = function(data, event){
		//only show cards where any word in the card matches the word in the search bar.
		console.log(self.filterSearch());
		console.log(self.myLocations().length);
		console.log(self.myLocations()[0]);
		//Remove cards not related to keywords
		self.myLocations.remove(function(item){return item.vName.search(self.filterSearch()) < 1});
		//Remove markers not related to keywords
		//Go through remaining locations and remove all markers that don't have matching ID of the remaining locations
		var newMarkers = []
		for(var i = 0; i < markers.length; i++){
			for(var j = 0; j < self.myLocations().length; j++){
				if(markers[i].id == self.myLocations()[j].id){
					newMarkers.push(markers[i]);
				}
			}
		}
		console.log(newMarkers);
		setMapOnAll(null);
		markers = newMarkers;
		setMapOnAll(map);
	}
	
	//Get results from Foursquare API using search terms that the user inputs.
	self.searchFSquare = function(){

		function getResults(){
			//Delete any existing markers
			setMapOnAll(null);
			markers = [];
			var URL = "https://api.foursquare.com/v2/venues/explore?ll=33.755,-84.390&radius=5000&client_id=" + clientID + "&client_secret=" + clientSecret + "&query=" + self.userSearch() + "&v=20160101";
			//Ajax call to get venue info usingthe Foursquare API.
			var info = $.ajax({
				type: 'GET',
				url: URL,
				dataType: 'json',
			})
			.fail(function() {
				self.errorMessage("Data can't be loaded");
			})
			.done(function(data) {
				//The two functions below kick everything off. 
				results = data;
				createMarkersAndInfoWindows(results);
				setMapOnAll(map);
			});
		}

		
		function createMarkersAndInfoWindows(results){
			//Make array of markers to put on the map.
			self.myLocations.removeAll();
			var responseLength = results.response.groups[0].items.length;
			//If there are no venues to report from Foursquare, report error. 
			if(responseLength < 1){
				self.errorMessage("Too few results. Try again.");
				self.filterArea(false);
			}else{
				self.errorMessage("");
				self.filterArea(true);
			}
			var lat;
			var lng;
			var currentMarker = null;
			var currentLocation;
			//Take the first 15 results from Foursquare and create markers and push the markers to the map.
			for(var i = 0; i < Math.min(15, responseLength); i++){
				lat = results.response.groups[0].items[i].venue.location.lat;
				lng = results.response.groups[0].items[i].venue.location.lng;
				var venueName = results.response.groups[0].items[i].venue.name;
				//Populate sidebar with venue names
				currentLocation = {vName: venueName, tipUrl: results.response.groups[0].items[i].tips[0].canonicalUrl};
				console.log("tipUrl is: " + currentLocation.tipUrl);
				currentLocation.id = i;
				self.myLocations.push(currentLocation);
				//Make a new marker
				var myLatlng = new google.maps.LatLng(lat,lng);
    			var marker = new google.maps.Marker({
    				position: myLatlng,
    				title: "Hello World!",
    				animation: google.maps.Animation.DROP,
    				id: i
				});
				markers.push(marker);

				//Set event listeners for the InfoWindows to open upon the marker being clicked.
				google.maps.event.addListener(markers[i], 'click', (function(i) {
    				return function(){
    					var tip = results.response.groups[0].items[i].tips[0].text;
						var phone = results.response.groups[0].items[i].venue.contact.phone;
						var venueName = results.response.groups[0].items[i].venue.name;
						var contentString = '<h2>' + venueName + '</h2><p>' + tip + '</p>' + '<p>' + phone + '<p>';
						infoWindow.setContent(contentString);
						infoWindow.id = i;
						infoWindow.open(map,markers[i]);

						//Make the current marker bounce
						setBouncingMarker(markers[i]);
    				}
	      		})(i));
			}

		}
		
		//Make the markers bounce when clicked. 
		function setBouncingMarker(marker){
			if(bouncingMarker){
				bouncingMarker.setAnimation(null);
			}
			if(bouncingMarker != marker){
				marker.setAnimation(google.maps.Animation.BOUNCE);
				bouncingMarker = marker;
			}else{
				bouncingMarker = null;
			}
		}

		//when a user clicks on a card in the right pane, the info window for that card activates and the marker bounce animation is enabled.
		self.cardClicked = function(card){
			//activate markers[card.id]
			setBouncingMarker(markers[card.id]);
			//Make the infoWindow with the same ID as the marker and the card to appear
			var tip = results.response.groups[0].items[card.id].tips[0].text;
			var phone = results.response.groups[0].items[card.id].venue.contact.phone;
			var venueName = results.response.groups[0].items[card.id].venue.name;
			var contentString = '<h2>' + venueName + '</h2><p>' + tip + '</p>' + '<p>' + phone + '<p>';
			infoWindow.setContent(contentString);
			infoWindow.id = card.id;
			infoWindow.open(map,markers[card.id]);
		}

		self.openTipPage = function(){
			alert("I got here!");
		}

			
		//Make it go
		getResults();	
	}

	

}

//activates knockout.js
ko.applyBindings(new AppViewModel());

