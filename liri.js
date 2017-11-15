// require
var Twitter = require('twitter');
var twitterKeys = require('./keys');

// store keys in variables
// var consumerKey = twitterKeys.consumer_key;
// var consumerSecret = twitterKeys.consumer_secret;
// var accessTokenKey = twitterKeys.access_token_key;
// var accessTokenSecret = twitterKeys.access_token_secret;

var client = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
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
        // client.get(path, params, callback);
        client.get('statuses/user_timeline', {count:20}, function(error, tweets, response) {
            if (error) {
                throw error;
            } else {
                for (var i = 0; i < tweets.length; i++) {
                    console.log("@bootcamp_wz tweeted: " + tweets[i].text + " on " + tweets[i].created_at);
                }
            }
        });
    } else if (userCommand === "spotify-this-song") {

    } else if (userCommand === "movie-this") {

    } else if (userCommand === "do-what-it-says") {

    }
} else {
    console.log("Sorry, command not found ]=");
}