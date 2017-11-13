var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')

app.use(express.static(path.join(__dirname, 'client')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(bodyParser.json())

app.listen(8000, function () {
	console.log('Listening to port 8000');
})
