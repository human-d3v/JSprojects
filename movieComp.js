const apiKey = 'f7b2346e';
const url = `http://www.omdbapi.com/`;

const autoCconfig = {
 renderOption(movie){
      const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; //handle broken images from API
      return `
          <img src="${imgSrc}" />
              ${movie.Title} (${movie.Year})
      `;
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
};


createAutoComplete({
  ...autoCconfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie){
      document.querySelector(".tutorial").classList.add('is-hidden');
      return onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }
 });


createAutoComplete({
  ...autoCconfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie){
      document.querySelector(".tutorial").classList.add('is-hidden');
      return onMovieSelect(movie, document.querySelector('#right-summary'),'right');
  } 
});


let leftMovie;
let rightMovie;

//user select 
const onMovieSelect = async (movie, summaryElement, side) => { //fetch one movie
    const resp = await axios.get(url,{
        params: {
            apikey: apiKey,
            i: movie.imdbID
        }
    });
    
    summaryElement.innerHTML = movieTemplate(resp.data);
    if(side === 'left'){
      leftMovie = resp.data;
    }else {
      rightMovie = resp.data;
    }

    if(leftMovie && rightMovie){
      runComparison();
    }
};

const runComparison = () => {
  let leftSum = document.querySelectorAll('#left-summary .notification');
  let rightSum = document.querySelectorAll('#right-summary .notification');
  leftSum.forEach((leftStat, index) =>{
    const rightStat = rightSum[index];
    const leftVal = parseFloat;(leftStat.dataset.value);
    const rightVal = parseFloat(rightStat.dataset.value);

    if(leftVal > rightVal){
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    } else {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
  })
}

const movieTemplate = movieDetail => {
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  const rating = parseFloat(movieDetail.imdbRating);
  const votes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
  const awards = movieDetail.Awards.split(' ').reduce((prev,word) => {
    const val = parseInt(word);
    if(isNaN(val)) {
      return prev;
    } else {
      return prev + val;
    }
  },0); //defaults to 0

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
    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${rating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${votes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
