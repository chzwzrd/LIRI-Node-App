// require
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var allKeys = require('./keys');
// store keys in variables
// var consumerKey = twitterKeys.consumer_key;
// var consumerSecret = twitterKeys.consumer_secret;
// var accessTokenKey = twitterKeys.access_token_key;
// var accessTokenSecret = twitterKeys.access_token_secret;

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

// // console insight
// console.log(twitterKeys);
// console.log(consumerKey);

// conditions to validate command and appropriate actions
if (commandArray.includes(userCommand)) {
    if (userCommand === "my-tweets") {
        // twitter.get(path, params, callback);
        twitter.get('statuses/user_timeline', {count:20}, function(error, tweets, response) {
            if (error) throw error;
            for (var i = 0; i < tweets.length; i++) {
                console.log("@bootcamp_wz tweeted: " + tweets[i].text + " on " + tweets[i].created_at);
            }
        });
    } else if (userCommand === "spotify-this-song") {
        var songName = process.argv[3];
        if (!songName) {
            spotify.search({ type:'track', query:'The Sign%20Ace%20of%20Base', limit:1 }, function(error, data) {
                if (error) throw error;
                console.log("Song: " + data.tracks.items[0].name + 
                "\nArtist: " + data.tracks.items[0].artists[0].name + 
                "\nAlbum: " + data.tracks.items[0].album.name + 
                "\nPreview link: " + data.tracks.items[0].preview_url);
            });
        } else {
            spotify.search({ type:'track', query:process.argv[3], limit:1 }, function(error, data) {
                if (error) throw error;
                console.log("Song: " + data.tracks.items[0].name + 
                "\nArtist: " + data.tracks.items[0].artists[0].name + 
                "\nAlbum: " + data.tracks.items[0].album.name + 
                "\nPreview link: " + data.tracks.items[0].preview_url);
            });
        }
    } else if (userCommand === "movie-this") {

    } else if (userCommand === "do-what-it-says") {

    }
} else {
    console.log("Command not found ):");
}