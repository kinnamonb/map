/* jshint esversion: 6 */

import { model } from './model.js';

var TownMap = function () {
    var self = this;

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

        self.setupMarkers();
    };

    self.setupMarkers = function () {
        // Track the number of markers that have been added
        var totalMarkers = model.locations.length;
        var markerCount = 0;
        // Make sure we close the details when a user closes the info window
        self.infoWindow.addListener('closeclick', function () {
            self.closeDetails();
        });

        // Create a new marker for each location
        model.locations.forEach(function (location, index) {
            // Offset the loading of the markers
            setTimeout(function () {
                self.createMarker(location);
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
            self.showDetails(location);
        });
        // Store important information
        location.marker = marker;
        self.bounds.extend(marker.getPosition());
    };

    // Hide the markers (remove the map) from those that do not match the filter
    self.filterMarkers = function (filterIndex) {
        model.locations.forEach(function (location) {
            location.marker.setMap(self.map);
            if (filterIndex !== 0 && location.filters.indexOf(filterIndex) === -1) {
                location.marker.setMap(null);
            } else {
                self.bounceMarker(location.marker);
            }
        });
    };

    self.bounceMarker = function (marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 700);
    };

    self.showDetails = function () {};
    self.closeDetails = function () {};

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
    };

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