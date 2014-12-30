var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var $ = require('jquery');
var searchStations = require('./helpers/_search-stations.js');
var stationData = require('./helpers/_station-data.js');


var SearchStations = React.createClass({

    getInitialState: function() {

        return {

            // indicates whether things are still loading
            loading: false,

            // all the station names that can be searched for
            stationNames: {},

            // all the stations that can be results
            stations: {},

            // the search terms the user is supplying
            searchTerm: ''

        };

    },

    componentWillMount: function() {

        this.setState({loading: true});

        $.when(stationData.getStationNames(), stationData.getStations()).done(
            function(stationNames, stations) {

                if (this.isMounted()) {
                    this.setState({
                        'loading': false,
                        'stationNames': stationNames[0],
                        'stations': stations[0]
                    });
                }

            }.bind(this)
        );

    },

    componentDidMount: function () {
        this.refs.input.getDOMNode().focus();
    },

    render: function() {

        var resultsNode;

        if (this.state.searchTerm.length > 1) {

            if (this.state.loading) {
                resultsNode = (
                    <section className="loading">
                        Bezig met laden...
                    </section>
                );
            } else {

                var results = searchStations(
                    this.state.searchTerm,
                    this.state.stationNames,
                    this.state.stations
                );

                if (results.length) {
                    resultsNode = (
                        <SearchResults data={results} />
                    );
                } else {
                    resultsNode = (
                        <section className="no-results">
                            Geen stations gevonden
                        </section>
                    );
                }

            }

        }

        return (
            <article className="search-stations">
                <input
                    type="text" ref="input" className="input"
                    placeholder="Zoek station" onKeyUp={this.handleKeyUp}
                />
                {resultsNode}
            </article>
        );

    },

    handleKeyUp: function() {
        this.setState({searchTerm: this.refs.input.getDOMNode().value});
    }

});

var SearchResults = React.createClass({

    render: function() {

        var resultNodes = [];

        for (var index in this.props.data) {
            resultNodes.push(
                <div key={index} className="result">
                    <Link
                        to="station" className="link"
                        params={{stationName: this.props.data[index].code}}
                    >
                        {this.props.data[index].name}
                    </Link>
                </div>
            );
        }

        return (
            <section className="search-results">
                {resultNodes}
            </section>
        );

    }

});

var Station = React.createClass({

    mixins: [Router.State],

    getInitialState: function() {
        return {
            station: null,
            departures: null
        };
    },

    componentDidMount: function() {

        stationData.getStations().done(function(stations) {
            this.setState({
                'station': stations[this.getParams().stationName]
            });
        }.bind(this));

        stationData.getStation(
            this.getParams().stationName
        ).done(function(departures) {
            this.setState({
                'departures': departures
            });
        }.bind(this));

    },

    render: function() {

        var headerContents;
        var departuresContents;

        if (this.state.station) {
            headerContents = this.state.station.name;
        } else {
            headerContents = 'Bezig met laden...';
        }

        if (this.state.departures) {

            departures = [];

            for (var index in this.state.departures) {

                var departure = this.state.departures[index];

                departures.push(
                    <tr key={index} className="departure">
                        <td>
                            <div className="departure-time">
                                {this.getDepartureTime(departure)}
                            </div>
                            {this.getDepartureDelayNode(departure)}
                        </td>
                        <td>
                            <div className="destination">
                                {departure.destination}
                            </div>
                            <div className="train-type">
                                {departure.train_type}
                            </div>
                            {this.getRouteTextNode(departure)}
                            {this.getRemarksNode(departure)}
                        </td>
                        <td>
                            {this.getPlatformNode(departure)}
                        </td>
                    </tr>
                );

            }

            departuresContents = (
                <div>
                    <table className="departures-table departures-table-header">
                        <thead>
                            <tr>
                                <th>Tijd</th>
                                <th>Naar</th>
                                <th>Spoor</th>
                            </tr>
                        </thead>
                    </table>
                    <div className="departures-table-body-container">
                        <table className="departures-table departures-table-body">
                            <tbody>
                                {departures}
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        } else {
            departuresContents = (
                <div className="loading">Bezig met laden...</div>
            );
        }

        return (
            <article className="station">
                <header className="station-header">
                    {headerContents}
                </header>
                <section className="departures">
                    {departuresContents}
                </section>
            </article>
        );

    },

    getDepartureTime: function(departure) {

        if (departure.departure_time) {

            var departure_time_parsed = Date.parse(departure.departure_time);

            if (departure_time_parsed) {

                var departure_time = new Date(departure_time_parsed);
                var hours = departure_time.getHours();
                var minutes = departure_time.getMinutes();

                if (hours < 10) hours = '0' + hours;
                if (minutes < 10) minutes = '0' + minutes;

                return hours + ':' + minutes;

            }

        }

        return '';

    },

    getDepartureDelayNode: function(departure) {

        if (departure.departure_delay > 0) {
            return (
                <div className="delay">
                    +{departure.departure_delay} min
                </div>
            );
        }

    },

    getRouteTextNode: function(departure) {

        if (departure.route_text) {
            return (
                <div className="route-info">
                    {departure.route_text}
                </div>
            );
        }

    },

    getRemarksNode: function(departure) {

        if (departure.remarks.length > 0) {

            var remarkNodes = [];

            for (var key in departure.remarks) {
                remarkNodes.push(<li>{departure.remarks[key]}</li>);
            }

            return <ul>{remarkNodes}</ul>;

        }

    },

    getPlatformNode: function(departure) {

        var classNames = ['platform'];

        if (departure.platform_changed) {
            classNames.push(' platform-changed');
        }

        classNames = classNames.join(' ');

        return (
            <div className={classNames}>
                {departure.platform}
            </div>
        );

    }

});

var Departures = React.createClass({

    mixins: [Router.State],

    render: function() {

        var backButtonNode;

        if (this.isActive('station')) {
            backButtonNode = (
                <Link to="departures" className="back-button">&lt;</Link>
            );
        }

        return (
            <div className="departures">
                <header className="departures-header">
                    {backButtonNode}
                    <h1>NS Vertrektijden</h1>
                </header>
                <RouteHandler />
            </div>
        );
    }

});

var routes = (
  <Route name="departures" path="/" handler={Departures}>
    <DefaultRoute handler={SearchStations}/>
    <Route name="station" path=":stationName" handler={Station}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.body);
});
