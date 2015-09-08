var $ = require('jquery');

var nsAPI = Object.create({

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

nsAPI.initialize();

module.exports = nsAPI;
