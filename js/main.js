(() => {
    const characterBox = document.querySelector("#character-list");
    const movieDetailsTemplate = document.querySelector("#movie-details-template");
    const movieDetailsCon = document.querySelector("#movie-details-con");
    const baseUrl = 'https://swapi.dev/api/';

    function getCharacters() {
        fetch(`${baseUrl}people/?format=json`)
            .then(response => response.json())
            .then(function(response) {
                const characters = response.results;
                characters.slice(0, 10).forEach(character => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.textContent = character.name;
                    a.href = '#';
                    if (character.films.length > 0) {
                        const filmIndex = Math.floor(Math.random() * character.films.length);
                        a.dataset.films = character.films[filmIndex];
                    }
                    a.addEventListener("click", getMovieDetails);
                    li.appendChild(a);
                    characterBox.appendChild(li);
                });
            })
            .catch(error => {
                console.error("Failed to fetch characters:", error);
            });
    }



    function getMovieDetails(event) {
        event.preventDefault();

        movieDetailsCon.innerHTML = "";
        const filmUrl = event.currentTarget.dataset.films;
  console.log("Character clicked:", event.currentTarget.textContent);
        fetch(`${filmUrl}?format=json`)
            .then(response => response.json())
            .then(function(film) {
                console.log("Fetched film details:", film);

                const template = document.importNode(movieDetailsTemplate.content, true);
                template.querySelector(".movie-title").textContent = film.title;
                template.querySelector(".movie-opening-crawl").textContent = film.opening_crawl;
                template.querySelector(".movie-poster").src = `img/${film.episode_id}.jpg`;
                movieDetailsCon.appendChild(template);
            })
            .catch(error => {
                console.error("Failed to fetch movie details:", error);
                console.log("Error fetching details for film URL:", filmUrl);
            });
    }

    getCharacters();
})();

