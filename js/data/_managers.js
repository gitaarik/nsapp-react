var moco = require('moco');
var collection = moco.collection;
var utils = moco.utils;
var models = require('./_models.js');
var nsAPI = require('./../helpers/_ns-api.js');

var stationManager = function() {
    this.collectionType = collection(models.station).use(utils.byId);
    this.collection = [];
};

stationManager.prototype = {

    initialize: function() {

        return new Promise(function(resolve, reject) {

            nsAPI.getStations().done((stations) => {
                this.initCollection(stations[0]);
            });

            resolve();

        });

    },

    initCollection: function(stationsData) {

        var stationModels = [];

        stationsData.forEach((stationData) => {
            stationModels.push(new models.station(stationData));
        });

        this.collection = new this.collectionType(stationModels);

    }

}
