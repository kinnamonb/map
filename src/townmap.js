var TownMap = function () {
    var self = this;
    
    self.ready = false; // Not done setting up

    self.init = function () {
        // Store some useful stuff so we can use it later
        self.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {
                lat: 39.575379,
                lng: -76.995815
            }
        });
        self.bounds = new google.maps.LatLngBounds();
        self.infoWindow = new google.maps.InfoWindow();
    };

    self.setupMarkers = function (locations, showDetails) {
        // Track the number of markers that have been added
        var totalMarkers = locations.length;
        var markerCount = 0;

        // Create a new marker for each location
        locations.forEach(function (location, index) {
            // Offset the loading of the markers
            setTimeout(function () {
                self.createMarker(location, showDetails);
                markerCount++;
                if (markerCount === totalMarkers) {
                    // Adjust the map view to see all of the markers
                    self.map.fitBounds(self.bounds);
                    // Store this new center so we can reset to it later
                    self.initialCenter = self.map.getCenter();
                    // Done setting up
                    self.ready = true;
                }
            }, index * 200);
        });
    };

    self.createMarker = function (location, showDetails) {
        // Create a marker
        var marker = new google.maps.Marker({
            position: location.position,
            animation: google.maps.Animation.DROP,
            map: self.map
        });
        // Add the click listener
        marker.addListener('click', function () {
            self.activateLocation(location);
            showDetails(location);
        });
        // Store important information
        location.marker = marker;
        self.bounds.extend(marker.getPosition());
    };

    self.filterMarkers = function (locations, filterIndex) {
        locations.forEach(function (listItem) {
            listItem.location.marker.setMap(self.map);
            if (filterIndex != 0 && listItem.location.filters.indexOf(filterIndex) === -1) {
                listItem.location.marker.setMap(null);
            } else {
                self.bounceMarker(listItem.location.marker);
            }
        });
    };

    self.bounceMarker = function (marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 700);
    };

    self.centerMap = function (marker) {
        self.map.panTo(marker.position);
    };

    self.showInfowWindow = function (location) {
        var output = '<h3>' + location.name + '</h3>';
        self.infoWindow.setContent(output);
        self.infoWindow.open(self.map, location.marker);
    };

    self.closeInfoWindow = function () {
        self.infoWindow.close();
    }

    self.activateLocation = function (location) {
        self.centerMap(location.marker);
        self.bounceMarker(location.marker);
        self.showInfowWindow(location);
    };

    self.recenter = function () {
        self.closeInfoWindow();
        self.map.panTo(self.initialCenter);
    };
};

var townMap = new TownMap();

window.townMap = townMap;

export default townMap;