// GLOBAL VARIABLES
// ====================================================================================
// require necessary modules
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var axios = require('axios');
var fs = require('fs');

// get access to API keys for Twitter & Spotify stored in keys.js
var allKeys = require('./keys');

var twitter = new Twitter({
    consumer_key: allKeys.twitterKeys.consumer_key,
    consumer_secret: allKeys.twitterKeys.consumer_secret,
    access_token_key: allKeys.twitterKeys.access_token_key,
    access_token_secret: allKeys.twitterKeys.access_token_secret
});

var spotify = new Spotify({
    id: allKeys.spotifyKeys.id,
    secret: allKeys.spotifyKeys.secret
});

// make array of actionable commands
var commandArray = [
    'my-tweets',
    'spotify-this-song',
    'movie-this',
    'do-what-it-says'
];

// store user's command argument into variable
var userCommand = process.argv[2];


// FUNCTIONS
// ====================================================================================
function requestTwitter() {
    // request last 20 tweets from my twitter account
    // syntax: twitter.get(path, params, callback);
    twitter.get('statuses/user_timeline', { count: 20 }, function (error, tweets, response) {

        // error handling
        if (error) throw error;

        // for each tweet in the response object
        for (var i = 0; i < tweets.length; i++) {

            // log out tweet content & when tweet was posted
            console.log("@bootcamp_wz tweeted: " + tweets[i].text + " on " + tweets[i].created_at);
        }
    });
}

function logSpotify(dataObject) {
    console.log("Song: " + dataObject.tracks.items[0].name);
    console.log("Artist: " + dataObject.tracks.items[0].artists[0].name);
    console.log("Album: " + dataObject.tracks.items[0].album.name);
    console.log("Preview link: " + dataObject.tracks.items[0].preview_url);
}

function requestSpotify(arg) {
    // if no argument provided
    if (!arg) {

        // GET request for 'The Sign' by Ace of Base
        spotify.search({ type: 'track', query: 'The Sign%20Ace%20of%20Base', limit: 1 }, function (error, data) {

            // error handling
            if (error) throw error;

            // log out relevant info for song
            logSpotify(data);

    });

    // if user provides song argument
    } else {

        // use song as query in GET request
        spotify.search({ type: 'track', query: arg, limit: 1 }, function (error, data) {

            // error handling
            if (error) throw error;

            // log out relevant info for user's song
            logSpotify(data);

        });
    }
}

function logOMDB(responseObject) {
    console.log("Title: " + responseObject.data.Title);
    console.log("Year: " + responseObject.data.Year);
    console.log("Rated: " + responseObject.data.Rated);
    console.log("IMDB Rating: " + responseObject.data.Ratings[0].Value);
    console.log("Rotten Tomatoes Rating: " + responseObject.data.Ratings[1].Value);
    console.log("Countries of Production: " + responseObject.data.Country);
    console.log("Language: " + responseObject.data.Language);
    console.log("Plot: " + responseObject.data.Plot);
    console.log("Actors: " + responseObject.data.Actors);
}

function requestOMDB(arg) {
    // if no argument provided
    if (!arg) {

        // axios GET request for 'Mr. Nobody'
        axios({
            method: 'get',
            url: 'http://www.omdbapi.com/?apikey=40e9cece&t=Mr%20Nobody&type=movie&r=json'
        })
            // log out relevant info
            .then(function(response) {
                logOMDB(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    // if user provides movie argument
    } else {

        // use movie as query in GET request
        axios({
            method: 'get',
            url: 'http://www.omdbapi.com/?apikey=40e9cece&t=' + arg + '&type=movie&r=json'
        })
            // log out relevant info
            .then(function(response) {
                logOMDB(response);
            })
            .catch(function (error) {
                console.log(error);
            });

    }
}

function executeCommands(command, argument) {
    // conditions to validate command and execute appropriate actions
    // if the user's argument is an actionable command
    if (commandArray.includes(command)) {

        // if Twitter command
        if (command === "my-tweets") {

            requestTwitter();

            // if Spotify command    
        } else if (command === "spotify-this-song") {

            requestSpotify(argument);

            // if OMDB command
        } else if (command === "movie-this") {

            requestOMDB(argument);

        // if File System command
        } else if (command === "do-what-it-says") {

            // use file content to execute appropriate command
            fs.readFile('./random.txt', 'utf8', function (error, data) {
                if (error) throw error;
                var fileArray = data.split(',');
                var fileCommand = fileArray[0];
                var fileArgument = fileArray[1];
                executeCommands(fileCommand, fileArgument);
            });

        }

    // if user's argument is not an actionable command
    } else {
        console.log("Command not found ):");
    }
}


// MAIN PROCESS
// ====================================================================================
executeCommands(userCommand, process.argv[3]);