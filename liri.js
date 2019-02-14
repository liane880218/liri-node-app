require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var fs = require("fs");

var userCommand = process.argv[2];
var artist, song, movie, artists;

function liriCommands(){
    switch(userCommand){
        case "concert-this":
            if(artist === undefined){
                if(process.argv.length > 3){
                    for(var j = 3; j< process.argv.length; j++){
                        artist === undefined ? artist = process.argv[j] : artist = artist + " " + process.argv[j];
                    }
                }
            }
            var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
            axios.get(queryUrl).then(
                function(response) {   
                    if(response.data.length > 0){
                        for(var i = 0; i < response.data.length; i++){
                            console.log("Name of the venue: " + response.data[i].venue.name);
                            console.log("Location: "+ response.data[i].venue.city);
                            console.log("Date of the event: " + moment(response.data[i].datetime).format('L')); 
                            fs.appendFile("log.txt", "User command: " + userCommand + "\n Response: " + response.data[i].venue.name + ", " + response.data[i].venue.city + ", " + moment(response.data[i].datetime).format('L') + "\n", function(err) {});                   
                        }
                    }else{
                        console.log("No events found");
                    }
                    
            }).catch((error)=>{ console.log(error.response.data.errorMessage)});
            break;
            
        case "spotify-this-song":
            if(song === undefined){
                if(process.argv.length > 3){
                    for(var j = 3; j< process.argv.length; j++){
                        song === undefined ? song = process.argv[j] : song = song + " " + process.argv[j];
                    }
                }else{
                    song = "The Sign";
                }
            }
            var spotify = new Spotify(keys.spotify);
            spotify
            .search({ type: 'track', query: song, limit:5})
            .then(function(response) {
                if(response.tracks.items.length > 0){
                    for(var i = 0; i < response.tracks.items.length; i++){
                        artists = [];
                        for(var j = 0; j < response.tracks.items[i].artists.length; j++){
                            artists.push(response.tracks.items[i].artists[j].name);
                        }
                        console.log("Artist(s): " + artists);
                        console.log("Song's name: " + response.tracks.items[i].name);
                        console.log("Preview link (Spotify): " + response.tracks.items[i].href);
                        console.log("Album's name: " + response.tracks.items[i].album.name);   
                        fs.appendFile("log.txt", "User command: " + userCommand + "\n Response: " + artists + ", " + response.tracks.items[i].name + ", " + response.tracks.items[i].href + ", " + response.tracks.items[i].album.name + "\n", function(err) {});                
                    }
                }else{
                    console.log("No songs found");
                }
            })
            .catch(function(err) {
            console.log(err);
            });
            break;

        case "movie-this":
            if(movie === undefined){
                if(process.argv.length > 3){
                    for(var j = 3; j< process.argv.length; j++){
                        movie === undefined ? movie = process.argv[j] : movie = movie + " " + process.argv[j];
                    }
                }else{
                    movie = "Mr. Nobody";
                }
            }    
            var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=13ac93d9";
            axios.get(queryUrl).then(
                function(response) {
                    if(response.data.Error !== undefined)
                        console.log(response.data.Error);
                    else{
                        console.log("Title: " + response.data.Title);
                        console.log("Release year: "+ response.data.Year);
                        console.log("IMDB rating: " + response.data.Ratings[0].Value);
                        console.log("Rotten tomatoes rating: " + response.data.Ratings[1].Value);
                        console.log("Country: " + response.data.Country);
                        console.log("Language: " + response.data.Language);
                        console.log("Plot: " + response.data.Plot);
                        console.log("Actors: " + response.data.Actors);
                        fs.appendFile("log.txt", "User command: " + userCommand + "\n Response: " + response.data.Title + ", " + response.data.Year + ", " + response.data.Ratings[0].Value + ", " + response.data.Ratings[1].Value + response.data.Country + ", " + response.data.Language + ", " + response.data.Plot + ", " + response.data.Actors + "\n", function(err) {});        
                    }
            });         
            break;
        
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function(err, data){
                if(err){
                    return
                }
                var dataArr = data.split(",");
                userCommand = dataArr[0];
                song = movie = artist = dataArr[1];
                liriCommands();
            });
            break;
    }
}
liriCommands();

