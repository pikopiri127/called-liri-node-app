// Preparation
// npm install request
// npm install moment
// npm install dotenv
// npm i node-spotify-api
// npm install --save bandsintown

// Test command
// -- work
// node liri.js concert-this bonjovi
// node liri.js movie-this rocky
// node liri.js spotify-this-song lalala
// node liri.js spotify-this-song I Want it That Way
// -- not work
// node liri.js do-what-it-says


require("dotenv").config();

// Get input
var command = process.argv[2];
var query = process.argv[3];

// Add the code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");

//---------------------//
// Function Definition //
//---------------------//
// #1 spotify-this-song
var spotifyThisSong = function (songQuery) {

    // Load Spotify api
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);

    // If no song is provided
    if (songQuery === undefined) {
        songQuery = "the sign ace of base";
    }

    // Search song
    spotify.search({ type: 'track', query: songQuery }, function (error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
        } else {
            for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
                if (i === 0) {
                    console.log("Artist(s):    " + data.tracks.items[0].artists[i].name);
                } else {
                    console.log("              " + data.tracks.items[0].artists[i].name);
                }
            }
            console.log("Song:         " + data.tracks.items[0].name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album:        " + data.tracks.items[0].album.name);
        }
    });
}

// #2 concert-this
var concertThis = function (concertQuery) {

    // Load request npm module
    var request = require("request");

    // Run a request to the Bands in Town API with the artist/band specified
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The ?app_id parameter is required, but can equal anything
    var queryUrl = "https://rest.bandsintown.com/artists/" + concertQuery + "/events?app_id=6de8a9d36628b1265de82836beb3f5d7";
    console.log(concertQuery)
    console.log(queryUrl)
    
    // Then run a request to the API with the band/artist specified
request(queryUrl, function(error, response, body) {

  // If the request was successful...
  if (!error && response.statusCode === 200) {
    var moment = require("moment");
    // Then log the body from the site!
    var location = JSON.parse(body)[0].venue.city + " " + JSON.parse(body)[0].venue.region + ", " + JSON.parse(body)[0].venue.country
    //use moment to format this as "MM/DD/YYYY"
    var responseDate = JSON.parse(body)[0].datetime
    console.log(responseDate)
    var date = moment(responseDate).format("MM/DD/YYYY");
    // Output
    console.log("Venue:             " + JSON.parse(body)[0].venue.name);
    console.log("Venue location:    " + location);
    console.log("Date of the Event: " + date); 

}
});
}


// #3 movie-this
var movieThis = function (movieQuery) {
    // Load request npm module
    var request = require("request");

    // if user doesn't type a movie in, the program will output data for the movie Mr. Nobody
    if (movieQuery === undefined) {
        movieQuery = "Mr. Nobody";
    }

    // Run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            console.log("* Title of the movie:        " + JSON.parse(body).Title);
            console.log("* Year the movie came out:   " + JSON.parse(body).Year);
            console.log("* IMDB Rating of the movie:  " + JSON.parse(body).imdbRating);
            console.log("* Country produced:          " + JSON.parse(body).Country);
            console.log("* Language of the movie:     " + JSON.parse(body).Language);
            console.log("* Plot of the movie:         " + JSON.parse(body).Plot);
            console.log("* Actors in the movie:       " + JSON.parse(body).Actors);

            // To get Rotten Tomatoes Rating value from Ratings array
            for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
                if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("* Rotten Tomatoes Rating:    " + JSON.parse(body).Ratings[i].Value);
                }
            }
        }
    })
}

//---------------------//
// Function Execution  //
//---------------------//
// Make it so liri.js can take in one of the following commands:
// -- spotify-this-song
// -- concert-this
// -- movie-this
// -- do-what-it-says
//
// Determine appropriate API according to command
if (command === "spotify-this-song") {
    spotifyThisSong(query);
} else if (command === "concert-this") {
    concertThis(query);
} else if (command === "movie-this") {
    movieThis(query);
} else if (command === "do-what-it-says") {
    // Liki will refer the text inside of random.text to run one of 3: concert-this/spotify-this/movie-this
    var fs = require("fs");
    fs.readFile("random.txt", "utf-8", function (error, data) {
        var command;
        var query;
        // Spliting the string to command and query
        if (data.indexOf(",") !== -1) {
            var dataArr = data.split(",");
            command = dataArr[0];
            query = dataArr[1];
        } else {
            command = data;
        }
        // Determine appropriate API according to the extracted command
        if (command === "spotify-this-song") {
            spotifyThisSong(query);
        } else if (command === "concert-this") {
            concertThis(query);
        } else if (command === "movie-this") {
            movieThis(query);
        } else {
            console.log("Command in random.text is not Valid.")
        }
    });
} else if (command === undefined) {
    console.log("Please enter a command.")
} else {
    // Entered command is not any of 3 nor NULL
    console.log("Entered command is not Valid.")
}
