const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? "" : movie.Poster;
        return `
        <img src="${imgSrc}">
        ${movie.Title} (${movie.Year})
        `
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: { apikey: 'bfa4358a', s: searchTerm }
        });
        if (response.data.Error) return [];
        return response.data.Search;
    }
}
createAutoComplete({
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.getElementById('left-summary'), 'left');
    },
    ...autoCompleteConfig
});
createAutoComplete({
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.getElementById('right-summary'), 'right');
    },
    ...autoCompleteConfig
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: 'bfa4358a',
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    if (side === 'left') leftMovie = response.data;
    else rightMovie = response.data;

    if (leftMovie && rightMovie) runComparison();
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        rightStat = rightSideStats[index];
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);
        if(rightSideValue>leftSideValue) {
            leftStat.classList.add('is-warning');
            rightStat.classList.add('is-primary');
        } else {
            rightStat.classList.add('is-warning');
            leftStat.classList.add('is-primary');
        }
    })
}

const movieTemplate = movie => {
    const dollars = parseInt(movie.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
    const metascore = parseInt(movie.Metascore);
    const imdbRating = parseFloat(movie.imdbRating);
    const imdbVotes = parseInt(movie.imdbVotes.replace(/,/g, ''));
    const awards = movie.Awards.split(" ").reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) return prev;
        else return prev + value;
    }, 0);
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movie.Poster === 'N/A' ? '' : movie.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movie.Title}</h1>
                    <h4>${movie.Genre}</h4>
                    <p>${movie.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification">
            <p class="title">${movie.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification">
            <p class="title">${movie.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification">
            <p class="title">${movie.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification">
            <p class="title">${movie.imdbRating}</p>
            <p class="subtitle">IMDb Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification">
            <p class="title">${movie.imdbVotes}</p>
            <p class="subtitle">IMDb Votes</p>
        </article>
    `
};