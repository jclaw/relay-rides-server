var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator'); // See documentation at https://github.com/chriso/validator.js
//var requester = require('request');
//var jquery = require('jquery');
var http = require('http');
var parseString = require('xml2js').parseString;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //res.header('Content-Type', 'application/x-www-form-urlencoded');
  next();
});


app.set('port', (process.env.PORT || 5000));



app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
 	response.send('relay rides server');
});

app.post('/getResults', function(request, response) {


	response.set('Content-Type', 'application/json');
	var data = request.body;
	

    var key = "vcn2bew8atv5dgtqtnjmncw3";

	var path = "/v1/search/car?apikey=" + key + "&dest=" + data.dest + "&startdate=" + data.startdate + "&enddate=" +
               data.enddate + "&pickuptime=" + data.pickuptime + "&dropofftime=" + data.dropofftime;

	var options = {
		host: "api.hotwire.com",
		path: path,
		method: 'GET',
		headers: {
			'Content-Type': 'text/xml'
		}
	};
	var str = '';
	var req = http.request(options, function(res) {
		console.log("STATUS: " + res.statusCode);
		console.log("HEADERS: " + JSON.stringify(res.headers));

		res.setEncoding('utf8');

		res.on('data', function(chunk) {
			str += chunk;
		})
		res.on('end', function() {
			console.log('No more data in response.');
			
			
			parseString(str, function (err, result) {
			    response.send(result);
			});
			
			
		})
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	//req.write("hello world");
	req.end();

});

app.get('/test', function(request, response) {
	response.set('Content-Type', 'application/json');
	console.log("request worked");
	console.log("request.body: " + JSON.stringify(request.body));
	console.log("request.body.dest: " + request.body.dest);
	//console.log(request);
});

app.post('/test', function(request, response) {
	response.set('Content-Type', 'application/json');
	console.log("request worked");
	console.log("request.body: " + JSON.stringify(request.body));
	console.log("request.body.dest: " + request.body.dest);
	//console.log(request);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


