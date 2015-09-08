var model = require('moco').model;

var stationModel = model()
    .attr('code', { primary: true })
    .attr('name');

module.exports = {
    station: stationModel
};
