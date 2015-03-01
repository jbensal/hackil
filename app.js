//API DOCUMENTATION
//Authorize user -> instagram login -> search.html/handleauth -> search.html
//Search.html enter query -> allInstagramFriendsData, factual, yelp data init
//instaFriends-> sends All friends search
//		input: none as long as long lat is set up properly from other calls. 
//		output: all friends within city
//instaFriendsDist:
//		input: dist, lat long
//		output: friends within dist of lat long

var express = require('express');
var bodyParser = require('body-parser')
var Factual = require('factual-api');
var natural = require('natural'),
    TfIdf = natural.TfIdf,
    tfidf = new TfIdf();

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
var async = require('async');

var instagram_data = null;
var factual_data = null;
var yelp_data = null;

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

//Globals
var redirect_uri = 'http://localhost:3000/search.html/handleauth';
var latitude;
var longitude;

//DB
var instagramdata = [];

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
  	instaSearch(latitude,longitude,5000)
	res.end('{"success" : "Updated Successfully", "status" : 200}');
}
function instaTuple(url,name,lat,long,description){
	this.url = url;
	this.name = name;
	this.lat = lat;
	this.long = long;
	this.description = description;
}

function instaSearch(latitude,longitude,distance1){
  api.location_search({ lat: latitude, lng: longitude, distance: distance1}, function(err, result, remaining, limit) {
  	console.log("INSTAGRAM")
  	temp = []
  	for( i = 0;i<result.length;i++){
		temp.push(result[i].id.toString());
  	}
  	unique = ArrNoDupe(temp)
	for( i = 0;i<unique.length;i++){
	    api.location_media_recent(unique[i], function(err, result, pagination, remaining, limit) {
	   	if(result[0]!=undefined)
	   	{
	   		tempLat = result[0].location.latitude;
	   		tempLong = result[0].location.longitude;
	   		tempUrl = result[0].images.standard_resolution.url;
	   		if(result[0].caption!=undefined)
	   			tempText = result[0].caption.text;
	   		tempName = result[0].user.full_name;

	   		var instagramTuple = new instaTuple(tempUrl,tempName,tempLat,tempLong,tempText);
	   		instagramdata.push(instagramTuple);
	   	}
	});
  	}
})
}
 exports.sendFriends = function(req,res){
 	res.status(200).send(instagramdata);
}

//Search route. Uses query parameters to pass in values into the Factual search.
exports.searchFunction = function(req, res) {
  console.log("SEARCH1")
  console.log(req.body)
  //latitude
  latitude = req.body.lat
  console.log("New Query ----------" );
  console.log("Latitude " + latitude)
  //longitude
  longitude = req.body.long
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

  async.parallel({
    yelp_function: function(callback){
      location;
      searchTerm = category;
      category = category;
      latlong = latitude+","+longitude;
      sortType = 0; // best match
      numResults = 10;

      yelp.search({location: location, category_filter: category, cll: latlong, sort: sortType, limit: numResults}, function(error, data) {
        console.log('yelp finished');
        callback(null, data)
      });
    },
    factual_function: function(callback){
      factual.get('/t/places-us', {filters:{category_ids:{"$includes_any":category_ids}}, geo:{"$circle":{"$center":[+latitude, +longitude],"$meters":1000}}}, function(fact_req, fact_res){
        console.log('factual finished');
        callback(null, fact_res.data);
      });
    }
  }, 
  function(err, results){
    factual_data = results['factual_function'];
    yelp_data = results['yelp_function'];

    console.log('result end');
    res.end('{"success" : "Updated Successfully", "status" : 200}');  
  });
};

//get followers
exports.getUsers = function(req,res){
  api.user_followers("self", function(err, users, pagination, remaining, limit) {
    console.log(users)
    console.log(err)
  });
}
exports.sendFriendsDist = function(req,res){
	api.location_search({ lat: req.body.latitude, lng: req.body.longitude, distance: req.body.distance}, function(err, result, remaining, limit) {
  	console.log("INSTAGRAM")
  	temp = []
  	var instagramdataDist = [];
  	for( i = 0;i<result.length;i++){
		temp.push(result[i].id.toString());
  	}
  	unique = ArrNoDupe(temp)
	for( i = 0;i<unique.length;i++){
	    api.location_media_recent(unique[i], function(err, result, pagination, remaining, limit) {
	   	if(result[0]!=undefined)
	   	{
	   		tempLat = result[0].location.latitude;
	   		tempLong = result[0].location.longitude;
	   		tempUrl = result[0].images.standard_resolution.url;
	   		if(result[0].caption!=undefined)
	   			tempText = result[0].caption.text;
	   		tempName = result[0].user.full_name;

	   		var instagramTuple = new instaTuple(tempUrl,tempName,tempLat,tempLong,tempText);
	   		instagramdataDist.push(instagramTuple);
	   	}
	   	if(i = unique.length-1){
	   		res.status(200).send(instagramdata);
	   	}
	});
  	}

})}

function ArrNoDupe(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

// This is where you would initially send users to authorize 
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI 
app.get('/search.html/handleauth', exports.handleauth);
app.get('/data', function(req, res){
  console.log(instagram_data);

  res.json({ data: instagram_data });
});
app.post('/instaSearch', exports.test); //initializes ALL friends search
app.get('/users', exports.getUsers);
app.post('/search', exports.searchFunction);
app.get('/instaFriends', exports.sendFriends); //sends ALL friends search
app.post('/instaFriendsDist', exports.sendFriendsDist); //sends friends within dist

app.get('/map', function(req, res) {
  res.render('map', {
    yelp: yelp_data,
    factual: factual_data
  });
});

app.get('/', function(req, res){
  console.log('request received on index')
  res.send('homepage');
});