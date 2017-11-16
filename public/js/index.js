const moviesRated = document.getElementById('moviesRated')
const moviesRecommended = document.getElementById('moviesRecommended')
const carouselUL = document.getElementById("carousel-container-ul")
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
	let genreId;
	let movieId = []
	Object.keys(input).forEach(key => {
		genreId = input[key].genreId
		movieId.push(input[key].id)
	})
	let results = await populateMovieRecommendations(input)
	Promise.all(results)
		.then((results) => getUniqueResults(results, movieId))
		.then(renderMovieRecommendations)
}

const populateMovieRecommendations = (data) => {
	const url = "/sendMovieData"
	return fetch(url, {
		method: 'POST',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then(result => result.json())
		.then(input => input)
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
	let recommendedMovieCount = 12;
	while (recommendedMovieCount > 0) {
		const randomMovie = input[Math.floor(Math.random() * input.length)]
		Object.keys(randomMovie).map(key => {
			if (key === 'poster_path') {
				const imageNode = createMovieImage()
				imageNode.className = "moviesRated--Poster-Element"
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
			imageNode.className = "moviesRated--Poster-Element"
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

	return imageNode;
}

const loadBackdrop = () => {
	const url = "/getBackDrop"
	fetch(url, {
		method: 'GET',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
	})
		.then(result => result.json())
		.then(spreadResults)
		.then(renderBackDrop)
		.catch(errorHandling)
}
const renderBackDrop = (input) => {
	if (input) {
		input.slice(0, 1).map(element => {
			const backdropDiv = createMovieDiv()
			const imageNode = createMovieImage()
			imageNode.className = 'slide showing';
			imageNode.setAttribute("src", `https://image.tmdb.org/t/p/w500/${element.backdrop_path}`)
			const movieTitle = document.createElement('h2')
			movieTitle.innerHTML = element.title
			movieTitle.className = 'title showing movieTitle';
			backdropDiv.appendChild(imageNode)
			backdropDiv.appendChild(movieTitle)
			const li = document.createElement('li')
			li.appendChild(backdropDiv)
			carouselUL.appendChild(li)
		})
		input.slice(1).map(element => {
			const backdropDiv = createMovieDiv()
			const imageNode = createMovieImage()
			imageNode.className = 'slide';
			imageNode.setAttribute("src", `https://image.tmdb.org/t/p/w500/${element.backdrop_path}`)
			const movieTitle = document.createElement('h2')
			movieTitle.innerHTML = element.title
			movieTitle.className = 'title';
			backdropDiv.appendChild(imageNode)
			backdropDiv.appendChild(movieTitle)
			const li = document.createElement('li')
			li.appendChild(backdropDiv)
			carouselUL.appendChild(li)
		})

		const slides = document.querySelectorAll("#carousel-container-ul .slide");
		const titles = document.querySelectorAll("#carousel-container-ul .title")
		let currentSlide = 0;
		let currentTitle = 0;
		const nextSlide = () => {
			slides[currentSlide].className = 'slide';
			titles[currentTitle].className = 'title';
			currentSlide = (currentSlide + 2) % slides.length;
			currentTitle = (currentTitle + 2) % titles.length;
			slides[currentSlide].className = 'slide showing'
			titles[currentTitle].className = 'slide showing movieTitle'
		}
		const slideInterval = setInterval(nextSlide, 4000)
	}
}

const init = (() => {
	getRatedMovies().then((ratedMoviesResults) => {
		getMovieRecommendations(ratedMoviesResults)
		renderMoviesRated(ratedMoviesResults)
	})
	loadBackdrop();
})()
