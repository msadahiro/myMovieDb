var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json())
require('./server/config/routes.js')(app)
app.listen(8000, function () {
	console.log('Listening to port 8000');
})
