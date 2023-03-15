/*this file will contain an function that will accept an object with the following callbacks/parameters:
    {
        fetchData(), //specific function for pulling data from an api
        renderOption(), //function that will know how to render the values returned from API
        onOptionSelect(), //function that will be invoked when user clicks an option rendered as specified above
        root //the element that the autocomplete will ultimately render on selection
    }
*/

const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData})=> {
 
  root.innerHTML = `
      <label><b>Search for a Movie</b></label>
      <input class="input" />
      <div class="dropdown">
          <div class="dropdown-menu">
              <div class="dropdown-content results"></div>
          </div>
      </div>
  `;
  // selectors (changed from document element to anchor itself in the root element)
  const input = root.querySelector('.input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');


  //user input
  const onInput = debounce(async event => {
      const items = await fetchData(event.target.value);

      if(!items.length) { //if user removes the search string, remove dropdown menu
          dropdown.classList.remove('is-active');
          return;
      };

      resultsWrapper.innerHTML = '';
      dropdown.classList.add('is-active'); //show dropdown

      for(let item of items){ //iterate over options returned from fetchData()
          const option= document.createElement('a'); 

          option.addEventListener('click', () => { //when an option is clicked from the dropdown menu, update the input text to match the title and remove dropdown
              dropdown.classList.remove('is-active');
              input.value = inputValue(item);
              onOptionSelect(item);
              
          });

          option.classList.add('dropdown-item');
          option.innerHTML = renderOption(item);
          resultsWrapper.appendChild(option);
      }
  },500);

  //event listeners
  input.addEventListener('input',onInput);

  document.addEventListener('click', event => { //hide dropdown if user clicks away from menu
      if(!root.contains(event.target)){
          dropdown.classList.remove('is-active');
      };
  }); 
};