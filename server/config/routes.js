
var movie = require('./../controllers/movie.js');
module.exports = function (app) {
	app.post("/sendMovieData", function (req, res) {
		movie.sendMovieData(req, res)
	})
	app.post("/searchMovie", function (req, res) {
		movie.searchMovie(req, res)
	})
	app.get("/getBackDrop", function (req, res) {
		movie.getBackDrop(req, res)
	})
};