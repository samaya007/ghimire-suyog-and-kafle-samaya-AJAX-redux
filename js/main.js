(() => {

	gsap.registerPlugin(ScrollTrigger);
	const characterBox = document.querySelector("#character-list");
	const movieDetailsTemplate = document.querySelector("#movie-details-template");
	const movieDetailsCon = document.querySelector("#movie-details-con");
	const loadingOverlay = document.querySelector('#loading-overlay');
	const baseUrl = 'https://swapi.dev/api/';
	//function for reloading animation
	function showLoadingOverlay() {
		loadingOverlay.style.display = 'flex';
	}
	function hideLoadingOverlay() {
		loadingOverlay.style.display = 'none';
	}
	function getCharacters() {
		showLoadingOverlay();
		fetch(`${baseUrl}people`)
			.then(response => response.json())
			.then(function(response) {
				hideLoadingOverlay();
				console.log(response);
				const characters = response.results;
				// This function extracts the results from the response.
				//and then slices the first 10 characters from this list.
				characters.slice(0, 10).forEach(character => {
					const li = document.createElement('li');
					const a = document.createElement('a');
					a.textContent = character.name;
					a.href = '#';
                    //this line of code checks if the character has been in any movies, if yes
                    //then randomly picks the movies the character has been in
					if (character.films.length > 0) {
						const filmIndex = Math.floor(Math.random() * character.films.length);
						a.dataset.films = character.films[filmIndex];
					}
					a.addEventListener("click", getMovieDetails);
					li.appendChild(a);
					characterBox.appendChild(li);
				});
				//start of gsap
				gsap.from('#character-list li', {
					opacity: 0,
					duration: 1,
					stagger: 0.2,
					scrollTrigger: {
						trigger: '#character-list',
						start: 'top bottom',
						toggleActions: 'restart none none none',
					},

				});
			})
			.catch(error => {
				hideLoadingOverlay();
				console.error("Failed to get characters:", error);
			});
	}
	function getMovieDetails(event) {
		//this line of code prevents the page from reloading
		event.preventDefault();
		//this line of code remove old movies
		movieDetailsCon.innerHTML = "";
		//for loading animation
		showLoadingOverlay();
		const filmUrl = event.currentTarget.dataset.films;
		console.log("Character clicked:", event.currentTarget.textContent);
		fetch(`${filmUrl}`)
			.then(response => response.json())
			.then(function(film) {
				hideLoadingOverlay();
				console.log("Fetched film details:", film);
				const template = document.importNode(movieDetailsTemplate.content, true);
				template.querySelector(".movie-title").textContent = film.title;
				template.querySelector(".movie-opening-crawl").textContent = film.opening_crawl;
				template.querySelector(".movie-poster").src = `images/${film.episode_id}.jpeg`;
				movieDetailsCon.appendChild(template);
			})
			.catch(error => {
				hideLoadingOverlay();
				console.error("Failed to get movie details:", error);
			});
	}

	getCharacters();
})();