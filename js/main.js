(() => {
	gsap.registerPlugin(ScrollTrigger);
	const characterList = document.querySelector("#list-of-characters");
	const movieOverviewTemplate = document.querySelector("#movie-overview-template");
	const movieInfoCon = document.querySelector("#movie-info-con");
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
					characterList.appendChild(li);
				});
				//start of gsap
				gsap.from('#list-of-characters li', {
					opacity: 0,
					duration: 1,
					stagger: 0.2,
					scrollTrigger: {
						trigger: '#list-of-characters',
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
		movieInfoCon.innerHTML = "";
		//for loading animation
		showLoadingOverlay();
		const filmUrl = event.currentTarget.dataset.films;
		console.log("Character clicked:", event.currentTarget.textContent);
		fetch(`${filmUrl}`)
			.then(response => response.json())
			.then(function(film) {
				//this line of code hides the loading spinner
				hideLoadingOverlay();
				console.log("Fetched details:", film);
				const template = document.importNode(movieOverviewTemplate.content, true);
				template.querySelector(".movie-title").textContent = film.title;
				template.querySelector(".movie-opening-crawl").textContent = film.opening_crawl;
				template.querySelector(".movie-poster").src = `images/${film.episode_id}.jpeg`;
				movieInfoCon.appendChild(template);
			})
			.catch(error => {
				hideLoadingOverlay();
				console.error("Failed to get movie details:", error);
			});
	}

	getCharacters();
})();