var express = require('express');
var Factual = require('factual-api');
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


