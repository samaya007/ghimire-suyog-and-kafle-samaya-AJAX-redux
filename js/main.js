(() => {
    const characterBox = document.querySelector("#character-list");
    const movieDetailsTemplate = document.querySelector("#movie-details-template");
    const movieDetailsCon = document.querySelector("#movie-details-con");
    const baseUrl = 'https://swapi.dev/api/';




//METHOD 01
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



//METHOD 2
/* IF this is implemneted, slight modification needs to be made on html
function getCharacters() {
    fetch(`${baseUrl}people`)
    .then(response => response.json())
    .then(function(response){
        console.log(response.results);
        const characters = response.results;
        const ul = document.createElement('ul');
        characters.forEach(character => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            // console.log(character['name']);
            a.textContent = character['name'];
            a.dataset.movies = character['films'];
            li.appendChild(a);
            ul.appendChild(li);
        });
        characterPane.appendChild(ul);
    })
    .then(function(){
        const links = document.querySelectorAll('#character-pane li a');
        links.forEach(link => {
            link.addEventListener('click', getMovies);
        })
    })
    .catch(errors => {
        console.log(errors);
        //send message to user in DOM, there was an issue
    });
}

*/

























// or function getMoive(e)
    function getMovieDetails(event) {
        event.preventDefault();

        // this clears previous movie details
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


