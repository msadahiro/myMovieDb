var API_KEY = require('./../config/apikey.js')
var fetch = require('node-fetch')
var Promise = require('promise')
module.exports = (function () {

	return {
		sendMovieData: function (request, response) {
			const MOVIEDBAPIKEY = API_KEY.getAPIKEY()
			let genreId;
			let results = [];
			Object.keys(request.body).forEach(key => {
				genreId = request.body[key].genreId
				if (request.body[key].rating > 3) {
					const movieRec = this.populateMovieRecommendations("https://api.themoviedb.org/3/discover/movie?api_key=" + MOVIEDBAPIKEY + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + genreId)
					results.push(movieRec)
				}
			})
			Promise.all(results)
				// .then(result => console.log(result))
				.then(result => response.send(result))
		},
		populateMovieRecommendations: function (input) {
			return fetch(input)
				.then(response => response.json())
				.then(final => this.spreadResults(final))
				.catch(this.errorHandling)
		},
		spreadResults: function (input) {
			return input.results
		},
		errorHandling: function (error) {
			console.log('err', error)
		},
		searchMovie: function (request, response) {
			let movieName = request.body.searchedMovie
			const MOVIEDBAPIKEY = API_KEY.getAPIKEY()
			fetch("https://api.themoviedb.org/3/search/movie?api_key=" + MOVIEDBAPIKEY + "&query=" + movieName)
				.then(response => response.json())
				.then(result => response.send(result))
				.catch(this.errorHandling)
		},
		getBackDrop: function (request, response) {
			const MOVIEDBAPIKEY = API_KEY.getAPIKEY()
			fetch("https://api.themoviedb.org/3/discover/movie?api_key=" + MOVIEDBAPIKEY + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1")
				.then(response => response.json())
				.then(result => response.send(result))
				.catch(this.errorHandling)
		}
	}
})()