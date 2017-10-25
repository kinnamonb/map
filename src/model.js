

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
            name: 'Bullock\'s Family Country Restaurant',
            position: {
                lat: 39.518414,
                lng: -76.984506
            },
            filters: [1]
        },
        {
            name: 'Baugher\'s Family Restaurant',
            position: {
                lat: 39.584615,
                lng: -77.010905
            },
            filters: [1]
        },
        {
            name: 'Players Fun Zone',
            position: {
                lat: 39.559904,
                lng: -76.979101
            },
            filters: [2]
        }
    ],

    // The filter options
    filters: ['All', 'Food', 'Fun', 'Shopping']
};

export default Model;