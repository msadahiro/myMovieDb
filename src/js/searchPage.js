const searchBar = document.getElementById('searchMovieName')
const movieResults = document.getElementById('movieResults')

let searchedTerm = ""
const CONFIG = "./../config/apikey.json";

const handleSearchChange = input => {
	searchedTerm = input.target.value;
	getMovies(searchedTerm)
}
async function getMovies(input) {
	const route = await getRoutes();
	const APIKEY = await getAPIKey();
	const query = route + APIKEY + "&query=" + input;
	populateSearchResults(query);
}
const getRoutes = () => {
	return fetch(CONFIG)
		.then(toJson)
		.then(returnEndpoint)
		.catch(errorHandling);
};
const getAPIKey = () => {
	return fetch(CONFIG)
		.then(toJson)
		.then(getAPIKEY)
		.catch(errorHandling)
};

const toJson = (response) => {
	return response.json();
};
const getAPIKEY = (input) => {
	return input.API_KEY;
}
const returnEndpoint = (response) => {
	return response.ENDPOINT.SEARCH;
};
const errorHandling = error => {
	console.log('error', error)
}

const populateSearchResults = input => {
	fetch(input)
		.then(toJson)
		.then(spreadResults)
		.then(populatePageWithResults)
		.catch(errorHandling)
}
const spreadResults = (input) => {
	return input.results;
}

const populatePageWithResults = input => {
	if (input) {
		movieResults.innerHTML = "";
		input.map(element => {
			// console.log(element)
			const rowNode = createMovieResultDiv()
			rowNode.className = "movieResult--Row"
			const imageNode = createMovieResultImage()
			imageNode.setAttribute("src", `https://image.tmdb.org/t/p/w500/${element.poster_path}`)
			imageNode.setAttribute("alt", element.title)
			const movieInfoDiv = createMovieResultDiv()
			movieInfoDiv.className = "movieResult--Overview"
			const titleNode = createMovieResultTitle()
			titleNode.innerHTML = element.title
			const descriptionNode = createMovieResultDescription()
			descriptionNode.innerHTML = element.overview;
			const starRatingNode = createStarRating(element.title, element.genre_ids, element.id)
			movieResults.appendChild(rowNode);
			rowNode.appendChild(imageNode);
			rowNode.appendChild(movieInfoDiv);
			movieInfoDiv.appendChild(titleNode);
			movieInfoDiv.appendChild(descriptionNode);
			movieInfoDiv.appendChild(starRatingNode);
		})
	}
}
const createMovieResultDiv = () => {
	const rowNode = document.createElement('div')
	return rowNode;
}
const createMovieResultImage = () => {
	const imageNode = document.createElement('img')
	imageNode.className = "movieResult--Poster-Element"
	return imageNode;
}
const createMovieResultTitle = () => {
	const titleNode = document.createElement('h2')
	return titleNode;
}
const createMovieResultDescription = () => {
	const descriptionNode = document.createElement('p')
	return descriptionNode;
}
const createStarRating = (movieTitle, genre, movieId) => {
	const starField = createMovieResultDiv()
	starField.className = "myStars"
	let count = 10;
	while (count > 0) {
		let starInput = createStarInput()
		starInput.type = "radio"
		starInput.name = `${movieTitle}rating`
		starInput.value = count;
		starInput.id = `${movieTitle}star${count}`
		starField.appendChild(starInput)
		let starLabel = createStarLabel()
		starLabel.htmlFor = `${movieTitle}star${count}`
		starLabel.innerHTML = `&starf;`
		starLabel.onclick = function () {
			const ratingObj = {}
			let movieName = this.parentNode.parentNode.firstChild.innerHTML
			let rating = this.previousElementSibling.value
			let randomGenreNumber = genre[Math.floor(Math.random() * genre.length)]
			ratingObj.id = movieId;
			ratingObj.movieName = movieName;
			ratingObj.rating = rating;
			ratingObj.imageURL = this.parentNode.parentNode.parentNode.firstChild.src
			ratingObj.genreId = randomGenreNumber
			if (!database.ref(`movies`).child(`${ratingObj.id}`)) {
				database.ref(`movies`).child(`${ratingObj.id}`).push(ratingObj)
			}
			database.ref(`movies`).child(`${ratingObj.id}`).update(ratingObj)
		}
		starField.appendChild(starLabel)
		count--
	}
	const starNumber = createMovieResultDescription()
	starField.appendChild(starNumber)
	return starField;
}
const createStarInput = () => {
	const input = document.createElement('input')
	return input;
}
const createStarLabel = () => {
	const label = document.createElement('label')
	return label;
}



searchBar.addEventListener('keyup', handleSearchChange);
