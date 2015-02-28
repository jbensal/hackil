var express = require('express');
var Factual = require('factual-api');
var factual = new Factual('FACTUAL_API_KEY', 'FACTUAL_SECRET')
var app = express();

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
console.log("Express server running on " + port);
console.log('hi');

app.get('/test', function(req, res){
	res.send('Hello, world');
});

app.listen(process.env.PORT || port);
