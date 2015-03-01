var express = require('express');
var bodyParser = require('body-parser')
var Factual = require('factual-api');
var factual = new Factual('onyxZs8ek9NvAOgX9NrqBtCwGXkZoRcgqnJVPmnN', 'yPIF4i2HaITiPy1C9DmHNG4xHSVXAnxlH2GgrFyP')
var yelp = require("yelp").createClient({
  consumer_key: "qydJIFh5gHAyMj6KlrNmtw", 
  consumer_secret: "VV0q8-sVQa8wvxTw_cvkl6YEgJM",
  token: "Z6QStj-d1SbkdOsuxhi9wyr3WH9C8xPx",
  token_secret: "v9RYnoJBG6SMcuJFFUjQP5Nm30o"
});

var bodyParser = require('body-parser')
var app = express();
var api = require('instagram-node').instagram();
var request = require('request');
var engines = require('consolidate');

app.use(express.static(__dirname + '/public'));
var port = process.env.PORT || 3000;
app.set('views', __dirname + '/views/');
app.engine('hbs', engines.handlebars);
app.set('view engine', 'hbs');
app.listen(process.env.PORT || port);
console.log("Express server running on " + port);

//Instagram Features:
api.use({ client_id: 'b61282d995b742f1b640cdbd5409ecd7',
         client_secret: '914640947582426aaf675a742b49dec5' });
app.use( bodyParser.json() );       // to support JSON-encoded bodies

var redirect_uri = 'http://localhost:3000/search.html/handleauth';
exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};
 
exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send(err);
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.redirect("http://localhost:3000/search.html")
    }

  });
};

//test function
exports.test = function(req,res){
  instaSearch(36.841557383,-76.135525865)
}

function instaSearch(latitude,longitude){
  api.location_search({ lat: latitude, lng: longitude, distance: 5000}, function(err, result, remaining, limit) {
  console.log(result[0].id.toString())

  api.location_media_recent(result[0].id.toString(), function(err, result, pagination, remaining, limit) {
   console.log(result)
  });
})
}

//Search route. Uses query parameters to pass in values into the Factual search.
exports.searchFunction = function(req, res) {
  console.log("SEARCH1")
  console.log(req.body)
  //latitude
  var latitude = req.body.lat
  console.log("New Query ----------" );
  console.log("Latitude " + latitude)
  //longitude
  var longitude = req.body.long
  console.log("Longitude " + longitude)
  var category = req.body.category;
  var location = req.body.location;

  // categories
  var cat_array = category;
  console.log(cat_array)
  var category_ids = new Array();
  for (var i = 0; i < cat_array.length; i++){
    if (cat_array[i] == "auto"){
      category_ids.push(2);
    }
    else if (cat_array[i] == "gov"){
      category_ids.push(20);
    }
    else if (cat_array[i] == "health"){
      category_ids.push(62);
    }
    else if (cat_array[i] == "landmarks"){
      category_ids.push(107);
    }
    else if (cat_array[i] == "retail"){
      category_ids.push(123);
    }
    else if (cat_array[i] == "biz"){
      category_ids.push(177);
    }
    else if (cat_array[i] == "social"){
      category_ids.push(308);
    }
    else if (cat_array[i] == "sports"){
      category_ids.push(372);
    }
    else if (cat_array[i] == "transport"){
      category_ids.push(415);
    }
    else if (cat_array[i] == "travel"){
      category_ids.push(430);
    }
  }
  console.log(category_ids);

  //Note that latitude and longitude must have 6 digits.
  var marker_data = null;
  factual.get('/t/places-us', {filters:{category_ids:{"$includes_any":category_ids}}, geo:{"$circle":{"$center":[+latitude, +longitude],"$meters":1000}}}, function(fact_req, fact_res){
    marker_data = fact_res.data;
    console.log(res.data)
  });

  location;
  searchTerm = category;
  category = category;
  latlong = latitude+","+longitude;
  sortType = 0; // best match
  numResults = 10;
  yelp.search({location: location, category_filter: category, cll: latlong, sort: sortType, limit: numResults}, function(error, data) {
    console.log(data);
  });

  res.render('map', {
      data: marker_data,
      categories: category_ids,
      lat: +latitude,
      lon: +longitude
    });
};

// This is where you would initially send users to authorize 
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI 
app.get('/search.html/handleauth', exports.handleauth);
app.post('/instaSearch', exports.test);
app.post('/search', exports.searchFunction);

app.get('/map', function(req, res) {
  res.render('map', {
    data: null
  });
});

app.get('/', function(req, res){
  console.log('request received on index')
  res.send('homepage');
});