// GLOBAL VARIABLES
// ====================================================================================
// require necessary modules
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var axios = require('axios');
var fs = require('fs');
// var prependFile = require('prepend-file');
// var inquirer = require('inquirer');

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

// store files into variable
var commandFile = './random.txt';
var logFile = './log.txt';

// store user's command into variable
var userCommand = process.argv[2];

// store user's entire argument into variable
var args = process.argv;
var userArgument = "";
for (var i = 3; i < args.length; i++) {
    userArgument += (" " + args[i]);
}
if (userArgument) {
    console.log(`User query: ${userArgument}`);
}


// FUNCTIONS
// ====================================================================================
function requestTwitter() {
    // request last 20 tweets from my twitter account
    // syntax: twitter.get(path, params, callback);
    twitter.get('statuses/user_timeline', { count: 20 }, function(error, tweets, response) {

        // error handling
        if (error) throw error;

        // create array to push each tweet to
        var tweetsArr = [];

        // for each tweet in the response object
        for (var i = 0; i < tweets.length; i++) {

            // push each tweet content & when tweet was posted to array
            tweetsArr.push(`\t@bootcamp_wz tweeted: ${tweets[i].text} on ${tweets[i].created_at}`);

        }

        // join array by newline & log out
        var tweetsDisplay = tweetsArr.join('\n');
        console.log(tweetsDisplay);

        // output response to external file
        var logTwitter = 
            `Command: my-tweets\n` +
            `Response:\n${tweetsDisplay}\n` +
            `\n--------------------------------------\n\n`;
        outputData(logFile, logTwitter);
        console.log('---------------\nlog.txt updated!\n---------------\n');

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

    // create array to push all song info to
    var spotifyArr = [
        "\tSong: " + dataObject.tracks.items[0].name,
        "\tArtist: " + dataObject.tracks.items[0].artists[0].name,
        "\tAlbum: " + dataObject.tracks.items[0].album.name,
        "\tPreview link: " + dataObject.tracks.items[0].preview_url
    ];

    // join array by newline & log out
    var spotifyDisplay = spotifyArr.join('\n');
    console.log(spotifyDisplay);

    // output data response to external file
    var logSpotify = 
        `Command: spotify-this-song\n` +
        `Query: ${userArgument}\n` +
        `Response:\n${spotifyDisplay}\n` +
        `\n--------------------------------------\n\n`;
    outputData(logFile, logSpotify);
    console.log('---------------\nlog.txt updated!\n---------------\n');

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
    // create array to push all song info to
    var omdbArr = [
        "\tTitle: " + responseObject.data.Title,
        "\tYear: " + responseObject.data.Year,
        "\tRated: " + responseObject.data.Rated,
        "\tIMDB Rating: " + responseObject.data.Ratings[0].Value,
        "\tRotten Tomatoes Rating: " + responseObject.data.Ratings[1].Value,
        "\tCountries of Production: " + responseObject.data.Country,
        "\tLanguage: " + responseObject.data.Language,
        "\tPlot: " + responseObject.data.Plot,
        "\tActors: " + responseObject.data.Actors
    ];

    // join array by newline & log out
    var omdbDisplay = omdbArr.join('\n');
    console.log(omdbDisplay);

    // output data response to external file
    var logOMDB =
        `Command: movie-this\n` +
        `Query: ${userArgument}\n` +
        `Response:\n${omdbDisplay}\n` +
        `\n--------------------------------------\n\n`;
    outputData(logFile, logOMDB);
    console.log('---------------\nlog.txt updated!\n---------------\n');
   
}

function metaCommand(file) {

    // read file & parse data
    fs.readFile(file, 'utf8', function(error, data) {

        // make data into array
        var fileArray = data.split(',');

        // capture the command used in the file
        var fileCommand = fileArray[0];

        // if a query is included in the file
        if (fileArray[1]) {

            // capture query
            var fileArgument = fileArray[1];

            // remove surrounding quotes
            fileArgument = fileArgument.slice(1, fileArgument.length - 1);

            // log out the command + query
            console.log(`${fileCommand}: ${fileArgument}`);

        } else {
            return;
        }

        // output response to external file
        outputData(logFile, 'Meta-command: do-what-it-says\n');

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

            var logMeta = 
                'Command: do-what-it-says\n' +
                'Response: Too deep!\n' +
                '\n--------------------------------------\n\n';
            outputData(logFile, logMeta);
            console.log('---------------\nlog.txt updated!\n---------------\n');

        } else {

            console.log("Sorry, command not found");

            var logNotFound = 
                `Command: ${fileCommand}\n` +
                `Response: Sorry, command not found\n` +
                `\n--------------------------------------\n\n`;
            outputData(logFile, logNotFound);
            console.log('---------------\nlog.txt updated!\n---------------\n');

        }
        // executeCommands(fileCommand, fileArgument);
    });

}

function outputData(file, content) {
    fs.appendFile(file, content, function(err) {
        if (err) throw err;
    });
}

function executeCommands(command, argument) {
    // conditions to validate command and execute appropriate actions
    // if user does not provide a command
    if (!command) {

        console.log('Please type a command\n');

    } else {

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
                metaCommand(commandFile);

            }

            // if user's argument is not an actionable command
        } else {
            console.log("Command not found ):\n");
        }
    }
}


// MAIN PROCESS
// ====================================================================================
// inquirer.prompt([
//     {
//         type: 'input',
//         name: 'instructions',
//         message: 'Please enter: node liri [command] ["query in quotes"]'
//     }
// ]).then(response => {
//     var responseArr = response.instructions.split(' ');
//     var userCommand = responseArr[2];
//     var userArgument = responseArr[3];
//     executeCommands(userCommand, userArgument);
//     // console.log(command.instructions.split(' ')[3]);
// });
executeCommands(userCommand, userArgument);