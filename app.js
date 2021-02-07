const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'bfa4358a',
            s: searchTerm
        }
    });
    if(response.data.Error) return []; 
    return response.data.Search;
}

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search for a Movie</b></label>
    <input class="input">
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async event => {
    const movies = await fetchData(event.target.value);
    if(!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }
    dropdown.classList.add('is-active');
    resultsWrapper.innerHTML = '';
    for(let movie of movies) {
        const option = document.createElement('a');
        option.classList.add("dropdown-item");
        const imgSrc = movie.Poster==='N/A' ? "" : movie.Poster; 
        option.innerHTML = `
        <img src="${imgSrc}">
        ${movie.Title} (${movie.Year})
        `;
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onMovieSelect(movie);
        });
        resultsWrapper.appendChild(option);
    }
}

input.addEventListener('input', debounce(onInput, 500));
document.addEventListener('click', event => {
    if(!root.contains(event.target)) dropdown.classList.remove('is-active'); 
});

const onMovieSelect = async (movie) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'bfa4358a',
            i : movie.imdbID
        }
    }); 
    document.querySelector('#target').innerHTML = movieTemplate(response.data);
};

const movieTemplate = movie => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movie.Poster==='N/A'?'':movie.Poster}">
                </p>
            </figure>
            <div class="media-right">
                <div class="content">
                    <h1>${movie.Title}</h1>
                    <h4>${movie.Genre}</h4>
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification">
            <p class="title">${movie.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification">
            <p class="title">${movie.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification">
            <p class="title">${movie.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification">
            <p class="title">${movie.imdbRating}</p>
            <p class="subtitle">IMDb Rating</p>
        </article>
        <article class="notification">
            <p class="title">${movie.imdbVotes}</p>
            <p class="subtitle">IMDb Votes</p>
        </article>
    `
};