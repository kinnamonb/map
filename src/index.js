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

    // Setup the markers based upon the model data
    townMap.setupMarkers(Model.locations, self.detailsView.open, self.detailsView.close);
    self.setup = true;  // Done setting up
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
    self.content = ko.observable('');

    self.open = function (location) {
        var details = '<h1>' + location.name + '</h1>';
        self.content(details);
        // Show the view
        self.isVisible(true);
    }

    self.close = function () {
        // Hide the view
        self.isVisible(false);
        // Recenter the map
        townMap.recenter();
    }
};

// Wait until the DOM is ready
$(function () {
    ko.applyBindings(new LocationsViewModel());
});