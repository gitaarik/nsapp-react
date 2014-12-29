var React = require('react');
var $ = require('jquery');
var searchStations = require('./helpers/_search-stations.js');


var SearchStations = React.createClass({

    getInitialState: function() {
        return {
            stations: {},
            stationNames: {}
        };
    },

    componentDidMount: function() {

        $.when(
            $.get('http://nsapi.televisionsmostpopularartinstructors.com/api/v1/stationnames/'),
            $.get('http://nsapi.televisionsmostpopularartinstructors.com/api/v1/stations/')
        ).done(function(stationNames, stations) {
            this.setState({
                'stationNames': stationNames[0],
                'stations': stations[0]
            });
        }.bind(this));

    },

    render: function() {
        return <SearchStationsFilter data={this.state} />
    }

});

var SearchStationsFilter = React.createClass({

    getInitialState: function() {
        return {searchTerm: ''};
    },

    render: function() {
        return (
            <section className="search-stations">
                <div className="input-container">
                    <input type="text" ref="input" className="input" placeholder="Zoek station" onKeyUp={this.handleKeyUp} />
                </div>
                <SearchResults data={searchStations(
                    this.state.searchTerm,
                    this.props.data.stationNames,
                    this.props.data.stations
                )} />
            </section>
        );
    },

    componentDidMount: function() {
        this.refs.input.getDOMNode().focus();
    },

    handleKeyUp: function() {
        this.setState({searchTerm: this.refs.input.getDOMNode().value});
    }

});

var SearchResults = React.createClass({

    render: function() {

        var resultNodes = [];

        for (var result in this.props.data) {
            resultNodes.push(
                <li key={result} className="result">{this.props.data[result].name}</li>
            );
        }

        return (
            <ul className="search-results">
                {resultNodes}
            </ul>
        );

    }

});

React.render(
    <div className="departure-times">
        <header className="header">
            <h1>NS Vertrektijden</h1>
        </header>
        <SearchStations />
    </div>,
    document.getElementById('app')
);
