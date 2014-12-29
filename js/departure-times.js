var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
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
                    <input type="text" ref="input" className="input"
                    placeholder="Zoek station" onKeyUp={this.handleKeyUp} />
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
                <li key={result} className="result">
                    <Link to="station">
                        {this.props.data[result].name}
                    </Link>
                </li>
            );
        }

        return (
            <ul className="search-results">
                {resultNodes}
            </ul>
        );

    }

});

var DepartureTimes = React.createClass({

    render: function() {
        return (
            <div className="departure-times">
                <header className="header">
                    <h1>NS Vertrektijden</h1>
                </header>
                <RouteHandler />
            </div>
        );
    }

});

var Station = React.createClass({

    render: function() {
        return (
            <div className="station">
                station!
            </div>
        );
    }

});

var routes = (
  <Route name="departure-times" path="/" handler={DepartureTimes}>
    <DefaultRoute handler={SearchStations}/>
    <Route name="station" handler={Station}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.body);
});
