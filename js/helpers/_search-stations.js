var Levenshtein = require('levenshtein');


module.exports = function(searchTerm, stationNames, stations) {

    function getStations() {

        var results = [];

        for (var stationName in stationNames) {

            var code = stationNames[stationName];
            var station = stations[code];

            // Calculating the score for a match, kinda
            // complicated, should document this maybe sometime.
            // Also refactor probably...

            stationName = stationName.toLowerCase();
            var score = 0;
            var searchWords;
            var searchWordKey;
            var searchWord;
            var stationWords;
            var stationWordKey;
            var stationWord;
            var levenshteinScore;

            if (stationName == searchTerm) {
                // exact match
                score += 1000;
            } else {
                
                if (
                    searchTerm.length > 1 &&
                    stationName.substr(0, searchTerm.length) == searchTerm
                ) {
                    // match start of string
                    score += 500;
                }

                searchWords = searchTerm.split(' ');
                stationWords = stationName.split(' ');

                // points per word
                for (searchWordKey in searchWords) {

                    searchWord = searchWords[searchWordKey].trim();

                    for (stationWordKey in stationWords) {

                        stationWord = stationWords[stationWordKey].trim();

                        if (stationWord == searchWord) {
                            // exact match of a single word
                            score += 200;
                            break;
                        } else if (
                            searchWord.length > 1 &&
                            stationWord.substr(0, searchWord.length) == searchWord
                        ) {
                            // match of start of single word
                            score += 100;
                            break;
                        }

                        if (searchWord.length > 3) {

                            levenshteinScore = new Levenshtein(
                                searchWord,
                                stationWord.substr(0, searchWord.length)
                            ).distance;

                            if (levenshteinScore > 3) {
                                score -= levenshteinScore;
                            } else {
                                score += (3 - levenshteinScore) * 10;
                            }

                        }

                        levenshteinScore = new Levenshtein(
                            searchWord, stationWord
                        ).distance;

                        if (levenshteinScore > 3) {
                            score -= levenshteinScore;
                        } else {
                            score += (3 - levenshteinScore) * 15;
                        }

                    }

                }

                levenshteinScore = new Levenshtein(
                    searchTerm, stationName
                ).distance;

                if (levenshteinScore > 3) {
                    score -= levenshteinScore;
                } else {
                    score += (3 - levenshteinScore) * 30;
                }

            }

            if (score > 0) {

                results.push({
                    'code': station.code,
                    'name': station.name,
                    'score': score
                });

            }

        }

        return results;

    }

    function sort(stations) { 
        return stations.sort(function(a, b) {
            return b.score - a.score;
        });
    }

    function removeDuplicates(stations) {

        var codes = [];

        for (var key in stations) {
            var station = stations[key];
            if (codes.indexOf(station.code) > -1) {
                delete stations[key];
            }
            codes.push(station.code);
        }

        return stations;

    }

    searchTerm = searchTerm.trim().toLowerCase();

    if (searchTerm.length > 1) {
        // Remove duplicates AFTER sorting so that the duplicate
        // that has the best position will be preserved.
        return removeDuplicates(sort(getStations()));
    } else {
        return [];
    }

};
