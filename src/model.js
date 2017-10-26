

var Model = {
    // The initial view data for the map
    initialView: {
        zoom: 12,
        center: {
            lat: 39.575379,
            lng: -76.995815
        }
    },

    // Various locations in/near Westminster, MD
    locations: [{
            name: 'Bullock\'s',
            position: {
                lat: 39.518414,
                lng: -76.984506
            },
            filters: [1],
            foursquareId: '4d3204c78c42a1cdde8ce45d'
        },
        {
            name: 'Baugher\'s',
            position: {
                lat: 39.584615,
                lng: -77.010905
            },
            filters: [1],
            foursquareId: '4bc5c3815935c9b6644ea6d2'
        },
        {
            name: 'Players Fun Zone',
            position: {
                lat: 39.559904,
                lng: -76.979101
            },
            filters: [2],
            foursquareId: '4c1d1968b4e62d7f0b29dc93'
        },
        {
            name: 'TownMall of Westminster',
            position: {
                lat: 39.578505,
                lng: -76.983051
            },
            filters: [1,3],
            foursquareId: '4bbb62301261d13a6c99eb98'
        }
    ],

    // The filter options
    filters: ['All', 'Food', 'Fun', 'Shopping']
};

export default Model;