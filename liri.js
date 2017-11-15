// require modules & necessary info
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var axios = require('axios');
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

// store argument into variable
var userCommand = process.argv[2];

// conditions to validate command and execute appropriate actions
// if the user's argument is an actionable command
if (commandArray.includes(userCommand)) {

    // if Twitter command
    if (userCommand === "my-tweets") {
        
        // request last 20 tweets from my twitter account
        // syntax: twitter.get(path, params, callback);
        twitter.get('statuses/user_timeline', {count:20}, function(error, tweets, response) {

            // error handling
            if (error) throw error;

            // loop through object
            for (var i = 0; i < tweets.length; i++) {

                // log out tweet content & when tweet was posted
                console.log("@bootcamp_wz tweeted: " + tweets[i].text + " on " + tweets[i].created_at);
            }

        });

    // if Spotify command    
    } else if (userCommand === "spotify-this-song") {

        // store song argument into variable
        var songName = process.argv[3];

        // if no argument provided
        if (!songName) {

            // GET request for 'The Sign' by Ace of Base
            spotify.search({ type:'track', query:'The Sign%20Ace%20of%20Base', limit:1 }, function(error, data) {

                // error handling
                if (error) throw error;

                // log out relevant info for song
                console.log("Song: " + data.tracks.items[0].name + 
                "\nArtist: " + data.tracks.items[0].artists[0].name + 
                "\nAlbum: " + data.tracks.items[0].album.name + 
                "\nPreview link: " + data.tracks.items[0].preview_url);

            });
        
        // if user provides song argument
        } else {

            // use song as query in GET request
            spotify.search({ type:'track', query:process.argv[3], limit:1 }, function(error, data) {

                // error handling
                if (error) throw error;

                // log out relevant info for user's song
                console.log("Song: " + data.tracks.items[0].name + 
                "\nArtist: " + data.tracks.items[0].artists[0].name + 
                "\nAlbum: " + data.tracks.items[0].album.name + 
                "\nPreview link: " + data.tracks.items[0].preview_url);

            });

        }

    // if OMDB command
    } else if (userCommand === "movie-this") {

        // store movie argument into variable
        var movieTitle = process.argv[3];

        // if no argument provided
        if (!movieTitle) {

            // axios GET request for 'Mr. Nobody'
            axios({
                method: 'get',
                url: 'http://www.omdbapi.com/?apikey=40e9cece&t=Mr%20Nobody&type=movie&r=json'
            })
                // log out relevant info
                .then(function(response) {
                    console.log("Title: " + response.data.Title);
                    console.log("Year: " + response.data.Year);
                    console.log("Rated: " + response.data.Rated);
                    console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                    console.log("Countries of Production: " + response.data.Country);
                    console.log("Language: " + response.data.Language);
                    console.log("Plot: " + response.data.Plot);
                    console.log("Actors: " + response.data.Actors);
                })
                .catch(function(error) {
                    console.log(error);
                });

        // if user provides movie argument
        } else {

            // use movie as query in GET request
            axios({
                method: 'get',
                url: 'http://www.omdbapi.com/?apikey=40e9cece&t=' + movieTitle + '&type=movie&r=json'
            })
                // log out relevant info
                .then(function (response) {
                    console.log("Title: " + response.data.Title);
                    console.log("Year: " + response.data.Year);
                    console.log("Rated: " + response.data.Rated);
                    console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                    console.log("Countries of Production: " + response.data.Country);
                    console.log("Language: " + response.data.Language);
                    console.log("Plot: " + response.data.Plot);
                    console.log("Actors: " + response.data.Actors);
                })
                .catch(function (error) {
                    console.log(error);
                });

        }

    // if File System command
    } else if (userCommand === "do-what-it-says") {

    }

// if user's argument is not an actionable command
} else {
    console.log("Command not found ):");
}