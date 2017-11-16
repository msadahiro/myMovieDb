var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json())
require('./server/config/routes.js')(app)
const port = process.env.PORT || 8000;
app.listen(port, function () {
	console.log('Listening to port 8000');
})
