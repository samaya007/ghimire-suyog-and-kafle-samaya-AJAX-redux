(() => {
	gsap.registerPlugin(ScrollTrigger);
	const characterList = document.querySelector("#list-of-characters");
	const movieOverviewTemplate = document.querySelector("#movie-overview-template");
	const movieInfoCon = document.querySelector("#movie-info-con");
	const loadingOverlay = document.querySelector('#loading-overlay');
	//starwars api 
	const baseUrl = 'https://swapi.dev/api/';
	//function for reloading animation 
	function showLoadingOverlay() {
		loadingOverlay.style.display = 'flex';
	}
	//this line hides the spinners once the data is fetched
	function hideLoadingOverlay() {
		loadingOverlay.style.display = 'none';
	}
	function getCharacters() {
		//shows loading overlay
		showLoadingOverlay();
		fetch(`${baseUrl}people`)
			.then(response => response.json())
			.then(function(response) {
			//hides loading overlay
				hideLoadingOverlay();
				console.log(response);
				const characters = response.results;
				// extracts the results from the response.
				//and then slices the first 10 characters from this list and creates list 
				characters.slice(0, 10).forEach(character => {
					const li = document.createElement('li');
					const a = document.createElement('a');
					a.textContent = character.name;
					a.href = '#';
                    //this line of code checks if the character has been in any movies, if yes
                    //then randomly picks the movies the character has been in
					if (character.films.length > 0) {
						//  a.dataset.films = JSON.stringify(character.films); -error
						const filmIndex = Math.floor(Math.random() * character.films.length);
						a.dataset.films = character.films[filmIndex];
					}
					//settiing up event listeners for charcters to get moive details
					a.addEventListener("click", getMovieDetails);
					li.appendChild(a);
					characterList.appendChild(li);
				});
				//start of gsap animation
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
				//cloning movew overiew with details
				const template = document.importNode(movieOverviewTemplate.content, true);
				template.querySelector(".movie-title").textContent = film.title;
				template.querySelector(".movie-opening-crawl").textContent = film.opening_crawl;
				//the images need to named 1.jpeg, 2.jpeg, etc focus on the format of the image i.e, .jpg or .jpeg . All images should have .jpeg if it has other fromat, change line 77 .jpeg 
				template.querySelector(".movie-poster").src = `images/${film.episode_id}.jpeg`;
				movieInfoCon.appendChild(template);
			})
			.catch(error => {
				hideLoadingOverlay();
				console.error("Failed to get movie details. ", error);
			});
	}
	getCharacters();
})();

/*Future Updates 
Could adda new function to show erro message:  function showError(message)
Adding alt atrributes in js like : poster.alt = `Poster of ${film.title}`; but for thsi we need to modify line 83 and add a nee querySelector
*/

