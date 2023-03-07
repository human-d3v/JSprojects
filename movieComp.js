const apiKey = 'f5b2346e';
const url = `http://www.omdbapi.com/`;


const fetchData = async (searchTerm) => {
    const resp = await axios.get(url, {
        params: {
            apikey: apiKey,
            s: searchTerm
        }
    });
    if(resp.data.Error) {
        return [];
    };
    return resp.data.Search;
};

//base HTML to access the dropdown menu
    const root = document.querySelector('.autocomplete');
    root.innerHTML = `
        <label><b>Search for a Movie</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;
    // selectors
    const input = document.querySelector('.input');
    const dropdown = document.querySelector('.dropdown');
    const resultsWrapper = document.querySelector('.results');


//user input
    const onInput = debounce(async event => {
        const movies = await fetchData(event.target.value);

        if(!movies.length) { //if user removes the search string, remove dropdown menu
            dropdown.classList.remove('is-active');
            return;
        };

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active'); //show dropdown

        for(let movie of movies){ //iterate over options returned from fetchData()
            const option= document.createElement('a'); 
            const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; //handle broken images from API

            option.addEventListener('click', () => { //when an option is clicked from the dropdown menu, update the input text to match the title and remove dropdown
                dropdown.classList.remove('is-active');
                input.value = movie.Title;
                onMovieSelect(movie)
            })

            option.classList.add('dropdown-item');
            option.innerHTML = `
                <img src="${imgSrc}" />
                ${movie.Title}
            `;

            resultsWrapper.appendChild(option);
        }
    },1000);

//user select 
    const onMovieSelect = async movie => { //fetch one movie
        const resp = await axios.get(url,{
            params: {
                apikey: apiKey,
                i: movie.imdbID
            }
        });
       
        document.querySelector('#summary').innerHTML = movieTemplate(resp.data);
    };

    movieTemplate = movieDetail => {
        return `
            <article class="media">
                <figure class="media-left">
                    <p class="image">
                        <img src="${movieDetail.Poster}" />
                    </p>
                </figure>
                <div class="media-content">
                    <div class="content">
                        <h1>${movieDetail.Title}</h1>
                        <h4>${movieDetail.Genre}</h4>
                        <p>${movieDetail.Plot}</p>
                    </div>
                </div>
            </article>
            <article class="notification is-primary">
                <p class="title">${movieDetail.Awards}</p>
                <p class="subtitle">Awards</p>
            </article>
            <article class="notification is-primary">
                <p class="title">${movieDetail.BoxOffice}</p>
                <p class="subtitle">Box Office</p>
            </article>
            <article class="notification is-primary">
                <p class="title">${movieDetail.Metascore}</p>
                <p class="subtitle">Metascore</p>
            </article>
            <article class="notification is-primary">
                <p class="title">${movieDetail.imdbRating}</p>
                <p class="subtitle">IMDB Rating</p>
            </article>
            <article class="notification is-primary">
                <p class="title">${movieDetail.imdbVotes}</p>
                <p class="subtitle">IMDB Votes</p>
            </article>
        `;
    }

//event listeners
    input.addEventListener('input',onInput);

    document.addEventListener('click', event => { //hide dropdown if user clicks away from menu
        if(!root.contains(event.target)){
            dropdown.classList.remove('is-active');
        };
    }); 
