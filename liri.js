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
    twitter.get('statuses/user_timeline', { count: 20 }, function(error, tweets, response) {

        // error handling
        if (error) throw error;

        // for each tweet in the response object
        for (var i = 0; i < tweets.length; i++) {

            // log out tweet content & when tweet was posted
            console.log("@bootcamp_wz tweeted: " + tweets[i].text + " on " + tweets[i].created_at);
        }
    });
}

function querySpotify(q) {

    // use default or user's argument to query song from Spotify
    spotify.search({ type: 'track', query: q, limit: 1 }, function(error, data) {

        // error handling
        if (error) throw error;

        // log out relevant info for song
        logSpotify(data);

    });
}

function requestSpotify(arg) {
    // if no argument provided
    if (!arg) {

        // GET request for 'The Sign' by Ace of Base
        querySpotify("The Sign Ace of Base");

    // if user provides song argument
    } else {

        // use song as query in GET request
        querySpotify(arg);
        
    }
}

function logSpotify(dataObject) {
    console.log("Song: " + dataObject.tracks.items[0].name);
    console.log("Artist: " + dataObject.tracks.items[0].artists[0].name);
    console.log("Album: " + dataObject.tracks.items[0].album.name);
    console.log("Preview link: " + dataObject.tracks.items[0].preview_url);
}

function queryOMDB(q) {

    // use default or user's argument to query movie from OMDB
    axios({
        method: 'get',
        url: 'http://www.omdbapi.com/?apikey=40e9cece&t=' + q + '&type=movie&r=json'
    })
        // log out relevant info
        .then(function(response) {
            logOMDB(response);
        })
        .catch(function(error) {
            console.log(error);
        });

}

function requestOMDB(arg) {

    // if no argument provided
    if (!arg) {

        // axios GET request for 'Mr. Nobody'
        queryOMDB("Mr. Nobody");

    // if user provides movie argument
    } else {

        // use movie as query in GET request
        queryOMDB(arg);

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

function readFile(file) {

    // read file & parse data
    fs.readFile(file, 'utf8', function(error, data) {

        // make data into array
        var fileArray = data.split(',');

        // capture command
        var fileCommand = fileArray[0];

        // if query exists, capture query & remove quotes
        if (!fileArray[1]) {
            return;
        } else {
            var fileArgument = fileArray[1];
            fileArgument = fileArgument.slice(1, fileArgument.length - 1);
            console.log(fileCommand + ": " + fileArgument);
        }

        // based on command, execute appropriate action
        if (error) {
            throw error;
        } else if (fileCommand === "spotify-this-song") {
            requestSpotify(fileArgument);
        } else if (fileCommand === "movie-this") {
            requestOMDB(fileArgument);
        } else if (fileCommand === "my-tweets") {
            requestTwitter();
        } else if (fileCommand === "do-what-it-says") {
            console.log("Too deep!");
        } else {
            console.log("Sorry, command not found");
        }
        // executeCommands(fileCommand, fileArgument);
    });

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
            readFile('./random.txt');

        }

    // if user's argument is not an actionable command
    } else {
        console.log("Command not found ):");
    }
}


// MAIN PROCESS
// ====================================================================================
executeCommands(userCommand, process.argv[3]);

// // conditions to validate command and execute appropriate actions
// // if the user's argument is an actionable command
// if (commandArray.includes(userCommand)) {

//     // if Twitter command
//     if (userCommand === "my-tweets") {

//         requestTwitter();

//     // if Spotify command    
//     } else if (userCommand === "spotify-this-song") {

//         requestSpotify(process.argv[3]);

//     // if OMDB command
//     } else if (userCommand === "movie-this") {

//         requestOMDB(process.argv[3]);

//     // if File System command
//     } else if (userCommand === "do-what-it-says") {

//         // use file content to execute appropriate command
//         readFile('./random.txt');

//     }

// // if user's argument is not an actionable command
// } else {
//     console.log("Command not found ):");
// }