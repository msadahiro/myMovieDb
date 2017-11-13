const moviesRated = document.getElementById('moviesRated')
const moviesRecommended = document.getElementById('moviesRecommended')
const CONFIG = "./../config/apikey.json";

const getRatedMovies = () => {
	return new Promise((resolve, reject) => {
		database.ref('/movies').on('value', (snapshot) => {
			if (snapshot.val()) {
				let ratedMovies = snapshot.val()
				resolve(ratedMovies)
			}
			resolve({})
		})
	})
}
async function getMovieRecommendations(input) {
	const API_KEY = await getAPIKEY();
	let genreId;
	let results = []
	let movieId = []
	Object.keys(input).forEach(key => {
		genreId = input[key].genreId
		movieId.push(input[key].id)
		results.push(populateMovieRecommendations(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`))
	})
	Promise.all(results)
		.then((results) => getUniqueResults(results, movieId))
		.then(renderMovieRecommendations)

}
const getAPIKEY = () => {
	return fetch(CONFIG, { method: 'GET' })
		.then(toJson)
		.then(returnAPIKEY)
		.catch(errorHandling)
}
const returnAPIKEY = input => {
	return input.API_KEY;
}
const populateMovieRecommendations = (input) => {
	return fetch(input, { method: 'GET' })
		.then(toJson)
		.then(spreadResults)
		.catch(errorHandling)
}

const toJson = (response) => {
	return response.json()
}
const spreadResults = (input) => {
	return input.results
}
const errorHandling = error => {
	console.log('error', error)
}

const getUniqueResults = (results, movieId) => {
	const mergeResults = [].concat.apply([], results);
	const removeDuplicates = (arr, prop) => {
		let obj = {};
		return Object.keys(arr.reduce((prev, next) => {
			if (!obj[next[prop]]) {
				obj[next[prop]] = next;
			}
			return obj;
		}, obj)).map((i) => obj[i])
	}
	const movieIdToDelete = new Set(movieId)
	const unique = removeDuplicates(mergeResults, 'id')
	const filterOutRatedMovies = unique.filter(obj => !movieIdToDelete.has(obj.id))
	return filterOutRatedMovies;
}
const renderMovieRecommendations = (input) => {
	let recommendedMovieCount = 14;
	while (recommendedMovieCount > 0) {
		const randomMovie = input[Math.floor(Math.random() * input.length)]
		Object.keys(randomMovie).map(key => {
			if (key === 'poster_path') {
				const imageNode = createMovieImage()
				imageNode.setAttribute("src", `https://image.tmdb.org/t/p/w500/${randomMovie[key]}`)
				moviesRecommended.appendChild(imageNode)
			}
		})
		input = input.filter(obj => {
			return obj.id !== randomMovie.id
		})
		recommendedMovieCount--;
	}
}
const renderMoviesRated = (input) => {
	if (input) {
		moviesRated.innerHTML = ""
		Object.keys(input).map(key => {
			const imageNode = createMovieImage()
			imageNode.setAttribute("src", input[key].imageURL)
			moviesRated.appendChild(imageNode)
		})
	}
}
const createMovieDiv = () => {
	const rowNode = document.createElement('div')
	return rowNode;
}
const createMovieImage = () => {
	const imageNode = document.createElement('img')
	imageNode.className = "moviesRated--Poster-Element"
	return imageNode;
}

const init = (() => {
	getRatedMovies().then((ratedMoviesResults) => {
		getMovieRecommendations(ratedMoviesResults)
		renderMoviesRated(ratedMoviesResults)
	})
})()