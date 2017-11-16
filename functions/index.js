const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const movie = require('./movie.js');



app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))
admin.initializeApp(functions.config().firebase);
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json())

app.post("/sendMovieData", function (request, response) {
	movie.sendMovieData(request, response)
})
app.post("/searchMovie", function (request, response) {
	movie.searchMovie(request, response)
})


exports.app = functions.https.onRequest(app);
