var React = require('react');
var $ = require('jquery');

var SearchStations = React.createClass({

    getInitialState: function() {
        return {
            stations: {},
            stationNames: {}
        };
    },

    componentDidMount: function() {

        $.get(
            'http://nsapi.televisionsmostpopularartinstructors.com/api/v1/stationnames/',
            function(response) {
                this.setState({stationNames: response});
            }.bind(this)
        );

        $.get(
            'http://nsapi.televisionsmostpopularartinstructors.com/api/v1/stations/',
            function(response) {
                this.setState({stations: response});
            }.bind(this)
        );

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
                <input type="text" ref="input" className="input" onKeyUp={this.handleKeyUp} />
                <SearchResults data={this.getSearchResults()} />
            </section>
        );
    },

    handleKeyUp: function() {
        this.setState({searchTerm: this.refs.input.getDOMNode().value});
    },

    getSearchResults: function() {
        return this.props.data.stations;
    }

});

var SearchResults = React.createClass({

    render: function() {

        var resultNodes = [];

        for (var result in this.props.data) {
            resultNodes.push(
                <li key={result}>{this.props.data[result].name}</li>
            );
        }

        return (
            <section className="search-results">
                {resultNodes}
            </section>
        );

    }

});

React.render(
    <div>
        <header>
            <h1>NS Vertrektijden</h1>
        </header>
        <SearchStations />
    </div>,
    document.getElementById('app')
);
