var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/music", { useNewUrlParser: true });

app.get('/scrape', function (req, res) {
    axios.get('https://pitchfork.com/reviews/albums/')
        .then(function (response) {
            let $ = cheerio.load(response.data);

            $('div.review').each(function (i, element) {
                let results = {};

                results.artist = $(this).children('li').text();
                results.title = $(this).children('h2').text();

                db.Album.create(results)
                    .then(function (dbAlbum) {
                        // console.log(dbAlbum);
                    }).catch(function (err) {
                        console.log(err);
                    });
            });
            res.send('Scrape Complete');
        });
});

app.get('/all', function (req, res) {
    db.Album.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
});

app.get("/saved", function(req, res) {
    // Go into the mongo collection, and find all docs where "read" is true
    db.Album.find({ saved: true }, function(error, found) {
      // Show any errors
      if (error) {
        console.log(error);
      }
      else {
        // Otherwise, send the books we found to the browser as a json
        res.json(found);
      }
    });
  });

app.put('/updatesaved/:id', function (req, res) {
    db.Album.update({
        _id: req.params.id
    },
        {
            $set: {
                saved: true
            }
        },
        function (error, edited) {
            // Show any errors
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                // Otherwise, send the result of our update to the browser
                console.log(edited);
                res.send(edited);
            }
        }
    );
});

app.put('/updateunsaved/:id', function (req, res) {
    db.Album.update({
        _id: req.params.id
    },
        {
            $set: {
                saved: false
            }
        },
        function (error, edited) {
            // Show any errors
            if (error) {
                console.log(error);
                res.send(error);
            }
            else {
                // Otherwise, send the result of our update to the browser
                console.log(edited);
                res.send(edited);
            }
        }
    );
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});