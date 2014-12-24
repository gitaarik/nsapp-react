var React = require('react');

var SearchStations = React.createClass({
    render: function() {
        return (
            <section class="search-stations">
                <input type="text" class="search-stations-input" />
            </section>
        );
    }
});

var SearchResults = React.createClass({

    render: function() {

        var resultNodes = this.props.data.map(function(result) {
            return (
                <li>{result.name}</li>
            );
        });

        return (
            <section class="search-results">
                {resultNodes}
            </section>
        );

    }

});

var searchResultsData = [
    { 'name': 'Amsterdam' },
    { 'name': 'Haarlem' }
];

React.render(
    <div>
        <header>
            <h1>NS Vertrektijden</h1>
        </header>
        <SearchStations />
        <SearchResults data={searchResultsData} />
    </div>,
    document.getElementById('app')
);
