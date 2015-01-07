var $ = require('jquery');


var stationData = Object.create({

    initialize: function() {
        this.baseUrl = 'http://nsapi.televisionsmostpopularartinstructors.com/api/v1/';
    },

    getStationNames: function() {
        return $.get(this.baseUrl + 'stationnames/');
    },

    getStations: function() {
        return $.get(this.baseUrl + 'stations/');
    },

    getDepartures: function(stationCode) {
        return $.get(this.baseUrl + 'departures/' + stationCode + '/');
    }

});

stationData.initialize();

module.exports = stationData;
