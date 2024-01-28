// /*
// -Suyog
// The image need to be in .jpeg format in order to show.
// While adding images name it 1.jpeg, 2.jpeg, ... 10.jpeg
// Match movie poster with title
// Responsiveness Part using grid
// GSAP animation and loading animation.

// Note:

// Check the ID's and Class before adding grid to it.
// Locally downloaded fonts is also used. 
// The color and typography still needs works done.
// JS is slightly modified to fetch exactly 10 data. I will search other alternative as well. 

// Feel free to make any necessary changes with layout
// When making chnages with ID's check once in JS and SASS
// */


(() => {
    const characterPanel = document.querySelector('#character-panel');
    const movieCon = document.querySelector('#movie-con');
    const loadingOverlay = document.querySelector('#loading-overlay');
    let currentMovieIndex = 0;
    const baseUrl = `https://swapi.dev/api/`;

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
            .then(response => {
                hideLoadingOverlay(); 

                const characters = response.results;
                const ul = document.createElement('ul');

                characters.slice(0, 10).forEach(character => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.textContent = character.name;
                    a.dataset.movies = character.films;
                    li.appendChild(a);
                    ul.appendChild(li);
                });

                characterPanel.appendChild(ul);
            })
            .then(() => {
                const links = document.querySelectorAll('#character-panel li a');
                links.forEach(link => {
                    link.addEventListener('click', getMovies);
                });
            })
            .catch(err => {
                hideLoadingOverlay(); // Hide loading overlay in case of an error
                console.log(err);
                // Send message to the user in the DOM, there was an issue
            });
    }

    function getMovies(e) {
        const movieURLs = e.currentTarget.dataset.movies;
    
        if (movieURLs) {
            showLoadingOverlay(); // Show loading overlay before fetching data

            const movieURLArray = movieURLs.split(',');

            if (currentMovieIndex < movieURLArray.length) {
                const currentMovieURL = movieURLArray[currentMovieIndex];

                fetch(currentMovieURL)
                    .then(response => response.json())
                    .then(movie => {
                        hideLoadingOverlay(); // Hide loading overlay after fetching data
                        movieCon.innerHTML = '';

                        const movieDesc = document.createElement('div');
                        movieDesc.classList.add('movie-description');
                        movieDesc.textContent = movie.opening_crawl;

                        const movieImage = document.createElement('img');
                        movieImage.classList.add('movie-image');
                        const episodeId = movie.episode_id;
                        movieImage.src = `images/${episodeId}.jpeg`;

                        movieCon.appendChild(movieImage);
                        movieCon.appendChild(movieDesc);

                        currentMovieIndex = (currentMovieIndex + 1) % movieURLArray.length;
                    })
                    .catch(error => {
                        hideLoadingOverlay(); // Hide loading overlay in case of an error
                        console.log(error);
                        // Handle errors or provide user feedback
                    });
            }
        }
    }

    getCharacters();
})();