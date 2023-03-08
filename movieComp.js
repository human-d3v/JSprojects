const apiKey = 'f5b2346e';
const url = `http://www.omdbapi.com/`;



createAutoComplete({
  root: document.querySelector('.autocomplete'),
  renderOption(movie){
      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; //handle broken images from API
      return `
          <img src="${imgSrc}" />
              ${movie.Title} (${movie.Year})
      `;
  },
  onOptionSelect(movie){
      return onMovieSelect(movie);
  },
  inputValue(movie){
      return movie.Title;
  },
  async fetchData(searchTerm){
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
  }
});


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
