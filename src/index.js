import ko from 'knockout';
import $ from 'jquery';
import './style.scss';
import townMap from './townmap.js';
import Model from './model.js';


var LocationsViewModel = function () {
    var self = this;

    // The view model for the list of locations
    self.locationList = new LocationListViewModel();
    self.detailsView = new DetailsViewModel();

    // Get the list of filters
    self.filters = Model.filters;

    // Watch the filter for changes
    self.selectedFilter = ko.observable();
    self.selectedFilter.subscribe(function (filter) {
        // Ignore changes before the map is ready
        if (!townMap.ready) {
            return;
        }
        // Filter the list of locations
        self.locationList.filter(filter)
        // Filter the map pins
        var index = Model.filters.indexOf(filter);
        townMap.filterMarkers(self.locationList.locations(), index);
    }, this);

    // For displaying
    self.listTitle = ko.computed(function () {
        return self.selectedFilter() + ' Destinations';
    });

    // Reset the map
    self.resetFilter = function () {
        // Reset the dropdown
        self.selectedFilter(Model.filters[0]);
        // Reset the list
        self.locationList.reset();
        // Reset the map
        townMap.recenter();
    };

    self.showLocation = function (listItem) {
        // Activate the location on the map
        townMap.activateLocation(listItem.location);
        // Show the details for the location
        self.detailsView.open(listItem.location);
    };

    self.toggle = function () {
        var panel = $('.sidePanel');
        if (panel.position().left < 10) {
            panel.animate({left: '10px'}, 200);
        } else {
            panel.animate({left: '-300px'}, 200);
        }
    };

    // Setup the markers based upon the model data
    townMap.setupMarkers(Model.locations, self.detailsView.open, self.detailsView.close);
    self.setup = true; // Done setting up
};


var LocationListViewModel = function () {
    var self = this;

    self.locations = ko.observableArray();

    self.filter = function (filter) {
        var index = Model.filters.indexOf(filter);
        self.locations().forEach(function (listItem) {
            listItem.isVisible(true);
            if (index != 0 && listItem.location.filters.indexOf(index) === -1) {
                listItem.isVisible(false);
            }
        });
    };

    // Reset the entire location list
    self.reset = function () {
        self.locations().forEach(function (listItem) {
            listItem.isVisible(true);
        });
    };

    // Load all of the locations into the list
    Model.locations.forEach(function (location) {
        self.locations.push(new ListItemViewModel(location));
    });
};

var ListItemViewModel = function (location) {
    var self = this;

    // Store information for later use
    self.location = location;
    self.name = location.name;
    self.isVisible = ko.observable(true);
};

var DetailsViewModel = function () {
    var self = this;

    self.isVisible = ko.observable(false);

    // Prepare for information
    self.name = ko.observable(null);
    self.url = ko.observable(null);
    self.phoneNumber = ko.observable(null);
    self.phoneLink = ko.computed(function () {
        return 'tel:' + self.phoneNumber();
    });
    self.phonePretty = ko.observable(null);
    self.address1 = ko.observable(null);
    self.address2 = ko.observable(null);
    self.statusText = ko.observable(null);
    self.status = ko.computed(function () {
        return '<strong>Today: </strong>' + self.statusText();
    });
    self.hours = ko.observableArray(null);
    self.hour = function (data) {
        var formatted = '<strong>' + data.days + ': </strong>' + data.open[0].renderedTime;
        return formatted;
    };

    self.foursquareUrl = 'https://api.foursquare.com/v2/venues/';
    self.foursquareAppend = '?v=20171026&m=foursquare&client_id=U4FAMHFYKYTW02WRADDJTHULGASZYJHMCWM4MCAMHHBNGYBM&client_secret=TFVBS5ZNPDBZSBDT4O41OGAEXRAWKVHR4V5WLVK42DM0GTJP'
    self.foursquareLink = ko.observable();

    self.open = function (location) {
        // Let the user know we're trying to get information
        self.address1('<h1>Loading information ...</h1>');

        // Start retrieving the information
        self.name(location.name);
        $.ajax({
            url: self.foursquareUrl + location.foursquareId + self.foursquareAppend,
            method: 'GET',
            // Something bad happened
            error: function (xhr, status) {
                self.address1('Unfortunately, there was a problem with gathering more information. Check your connection or wait a few minutes and try again.');
            },
            // Display the information we found
            success: function (data) {
                var venue = data.response.venue;

                if (venue.url) {
                    self.url(venue.url);
                }

                if (venue.contact.phone) {
                    self.phoneNumber(venue.contact.phone);
                    self.phonePretty(venue.contact.formattedPhone);
                }

                if (venue.location.formattedAddress) {
                    self.address1(venue.location.formattedAddress[0]);
                    self.address2(venue.location.formattedAddress[1]);
                }

                if (venue.hours) {
                    self.statusText(venue.hours.status);
                    self.hours(venue.hours.timeframes);
                }
                
                // Provide the source of our information
                self.foursquareLink(venue.shortUrl);
            }
        });

        // Show the view
        self.isVisible(true);
    }

    self.close = function () {
        // Hide the view
        self.isVisible(false);

        // Reset the data
        self.name(null);
        self.url(null);
        self.phoneNumber(null);
        self.phonePretty(null);
        self.address1(null);
        self.address2(null);
        self.statusText(null);
        self.hours(null);

        // Recenter the map
        townMap.recenter();
    }
};

// Wait until the DOM is ready
$(function () {
    ko.applyBindings(new LocationsViewModel());
});