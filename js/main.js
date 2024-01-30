/*
-Suyog
The image need to be in .jpeg format in order to show.
While adding images name it 1.jpeg, 2.jpeg, ... 10.jpeg
Match movie poster with title
Responsiveness Part using grid
GSAP animation and loading animation.

Note:

Check the ID's and Class before adding grid to it.
Locally downloaded fonts is also used. 
The color and typography still needs works done.
JS is slightly modified to fetch exactly 10 data. I will search other alternative as well. 

Feel free to make any necessary changes with layout
When making chnages with ID's check once in JS and SASS
*/



(() => {

    gsap.registerPlugin(ScrollTrigger);



    const characterBox = document.querySelector("#character-list");
    const movieDetailsTemplate = document.querySelector("#movie-details-template");
    const movieDetailsCon = document.querySelector("#movie-details-con");
    const loadingOverlay = document.querySelector('#loading-overlay');
    const baseUrl = 'https://swapi.dev/api/';

    function showLoadingOverlay() {
        loadingOverlay.style.display = 'flex';
    }

    function hideLoadingOverlay() {
        loadingOverlay.style.display = 'none';
    }


    function getCharacters() {
        showLoadingOverlay(); 
        fetch(`${baseUrl}people/?format=json`)
            .then(response => response.json())
            .then(function(response) {
                hideLoadingOverlay(); 
//new chagge
console.log(response);

                const characters = response.results;

// This function extracts the results from the response.
//and then slices the first 10 characters from this list.


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
                console.error("Failed to fetch characters:", error);
                
            });
    }



    function getMovieDetails(event) {
        event.preventDefault();
    
        movieDetailsCon.innerHTML = "";
        showLoadingOverlay();
        const filmUrl = event.currentTarget.dataset.films;
  console.log("Character clicked:", event.currentTarget.textContent);
        fetch(`${filmUrl}?format=json`)
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
                console.error("Failed to fetch movie details:", error);
                console.log("Error fetching details for film URL:", filmUrl);
            });
    }

    getCharacters();
})();

