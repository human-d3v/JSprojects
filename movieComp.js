const apiKey = 'f5b2346e';
let searchTerm = 'Llewyn Davis';
const url = `http://www.omdbapi.com/`;

const fetchData = async (searchTerm) => {
    const resp = await axios.get(url, {
        params: {
            apikey: apiKey,
            s: searchTerm
        }
    });
    console.log(resp.data);
};

const input = document.querySelector('#searchBox');
const debounce = (func) => {
    return () => {

    };
}

let timeoutId;
const onInput = (event) => {
    if (timeoutId) { //first loop will return undefined and bypass this logic. 
        clearTimeout(timeoutId);
    };
    timeoutId = setTimeout(() => {
        fetchData(event.target.value);
    },1000);
};

input.addEventListener('input',onInput);
