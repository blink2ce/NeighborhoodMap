function AppViewModel(){

	//Data
	var clientID = "DXJOXHELH1K44MFQUGUWKS2LDYW1FCIFV3YKXBVJSIKNTAZN";
	var clientSecret = "OFHCOKLL1KHDTB2F4YHNXV5RSQOWICRMQXLOTOXJTNRS2BSQ";
	this.userSearch = ko.observable("Where?");
	var markers = [];
	var bouncingMarker = null;
	var infoWindow = new google.maps.InfoWindow();
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
			//Make an array of markers
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
	    				title: "Hello World!",
	    				animation: google.maps.Animation.DROP
					});
					markers.push(marker);
				}
			}
			createMarkers(results);

			//Put markers on map
			function setMapOnAll(map) {
			  for (var i = 0; i < markers.length; i++) {
			    markers[i].setMap(map);
			  }
			}
			setMapOnAll(map);

			//Set event listeners for the InfoWindows to open upon the marker being clicked.
			function setInfoWindow(map, results){
				var responseLength = results.response.groups[0].items.length;
				var currentMarker = null;
				for(var i = 0; i < Math.min(15, responseLength); i++){
					google.maps.event.addListener(markers[i], 'click', (function(i) {
        				return function() {
        					var venueName = results.response.groups[0].items[i].venue.name;
							var tip = results.response.groups[0].items[i].tips[0].text;
							var phone = results.response.groups[0].items[i].venue.contact.phone;
							var contentString = '<h2>' + venueName + '</h2><p>' + tip + '</p>' + '<p>' + phone + '<p>';
        					infoWindow.setContent(contentString);
          					infoWindow.open(map,markers[i]);

          					//Make the current marker bounce
          					if(bouncingMarker){
          						bouncingMarker.setAnimation(null);
          					}
          					if(bouncingMarker != markers[i]){
          						markers[i].setAnimation(google.maps.Animation.BOUNCE);
          						bouncingMarker = markers[i];
          					}else{
          						bouncingMarker = null;
          					}
        				}
		      		})(i));
				}
			}
			setInfoWindow(map, results);

		});	
	}

}

//activates knockout.js
ko.applyBindings(new AppViewModel());

