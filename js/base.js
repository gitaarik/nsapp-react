var React = require('react');
var $ = require('jquery');

var SearchStations = React.createClass({

    getInitialState: function() {
        return {allStations: {}};
    },

    componentDidMount: function() {
        $.get(
            'http://nsapi.televisionsmostpopularartinstructors.com/api/v1/stations/',
            function(response) {
                this.setState({allStations: response});
            }.bind(this)
        );
    },

    render: function() {
        return <SearchStationsFilter data={allStations: this.state.allStations} />
    }

});

var SearchStationsFilter = React.createClass({

    getInitialState: function() {
        return {
            data: {
                allStations: {},
                searchResults: {}
            }
        };
    },

    render: function() {
        return (
            <section className="search-stations">
                <input type="text" className="search-stations-input" />
                <SearchResults data={this.state.allStations} />
            </section>
        );
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
