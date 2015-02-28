var express = require('express');
var Factual = require('factual-api');

var factual = new Factual('', '')
var app = express();
var api = require('instagram-node').instagram();

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
var request = require('request');

app.listen(process.env.PORT || port);

//Instagram Features:
api.use({ client_id: 'b61282d995b742f1b640cdbd5409ecd7',
         client_secret: '914640947582426aaf675a742b49dec5' });
console.log("ig")
var redirect_uri = 'http://localhost:3000/handleauth';
 
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
      res.send('You made it!!');
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

});

}

// This is where you would initially send users to authorize 
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI 
app.get('/handleauth', exports.handleauth);
app.get('/instaSearch', exports.test);

var port = process.env.PORT || 8000;
console.log("Express server running on " + port);

// factual.get('/t/places-us', {q:"starbucks", filters:{"$or":[{"locality":{"$eq":"los angeles"}},{"locality":{"$eq":"santa monica"}}]}}, function (error, res) {
//   console.log(res.data);
// });

// factual.get('/t/places-us/schema', function (error, res) {
//   console.log(res.view);
// });

app.get('/', function(req, res){
	console.log('request received on index')
	res.send('homepage');
});

//Search route. Uses query parameters to pass in values into the Factual search.
app.get('/search', function(req, res) {
  //latitude
  var latitude = req.query.lat
  console.log(typeof(+longitude));
  console.log("Latitude " + latitude)

  //longitude
  var longitude = req.query.lon
  console.log("Longitude " + longitude)
  
  //locality? country?

  // categories
  var cat_array = req.query.categories.split(',');
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
  	else if (cat_array[i] == "landmark"){
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

  //Note that latitude and longitude must have 6 digits.
  factual.get('/t/places-us', {filters:{category_ids:{"$includes_any":category_ids}}, geo:{"$circle":{"$center":[+latitude, +longitude],"$meters":1000}}}, function(req, res){
  	console.log(res.data);

  })

  res.send('hi');
});

app.listen(process.env.PORT || port);