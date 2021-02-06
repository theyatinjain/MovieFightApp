const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'bfa4358a',
            s: searchTerm
        }
    })
    if(response.data.Error) return []; 
    return response.data.Search;
}

const onInput = async event => {
    const movies = await fetchData(event.target.value);
    console.log(movies);
    for(let movie of movies) {
        const div = document.createElement('div');
        div.innerHTML = `
        <img src="${movie.Poster}">
        <h1>${movie.Title}</h1>
        `;
        document.getElementById('target').appendChild(div);
    }
}

const input = document.querySelector('input');
input.addEventListener('input', debounce(onInput, 500));