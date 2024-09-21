
//! Define an async function to fetch data from the API
async function fetchPokemon(pokemonId) {
  try {
    // Await the fetch response
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);

    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Await the conversion of the response to JSON
    const data = await response.json();
    const pokemonImage = data.sprites.other['official-artwork'].front_default;
    const pokemonName = data.name;
    const pokemonNameUpperCase = data.name.charAt(0).toUpperCase()
    + pokemonName.slice(1)
    const pokemonIdText = `#${String(data.id).padStart(3, '0')}`; // Format the ID to three digits;
    const pokemonType = data.types[0].type.name;
    let pokemonType2 = '';  // Initialize an empty string for the second type

    // Check if a second type exists
    if (data.types[1]) {
      pokemonType2 = data.types[1].type.name;
    }
    
    // console.log(data);
    return{pokemonImage,pokemonNameUpperCase, pokemonIdText, pokemonType, pokemonType2};

  } catch (error) {
    // Catch and log any errors
    console.error('Error fetching the Pokémon:', error);
  }
}

// !Populate the Pokémon cards
async function populatePokemonCards() {
  const pokemonDeckContainerEl = document.querySelector('.pokemon-deck-container')

  for (let index = 1; index < 152; index++) {
    const pokemonData = await fetchPokemon(index);  // Fetch Pokémon data for each ID
    // console.log(pokemonData);
    
    if(pokemonData){
        //*create a div, give it a class of pokemon-deck-card, then append it to the parent div with class pokemon-deck-container
        const pokemonDeckCardEl= document.createElement('div');
        pokemonDeckCardEl.classList.add('pokemon-deck-card', (`${pokemonData.pokemonType}`));

        // Add data attributes to the card
        pokemonDeckCardEl.dataset.id = pokemonData.pokemonIdText;
        pokemonDeckCardEl.dataset.name = pokemonData.pokemonNameUpperCase;
        pokemonDeckCardEl.dataset.type1 = pokemonData.pokemonType;
        pokemonDeckCardEl.dataset.type2 = pokemonData.pokemonType2 || ''; // Empty if no second type
        pokemonDeckCardEl.dataset.src = pokemonData.pokemonImage;

        pokemonDeckContainerEl.appendChild(pokemonDeckCardEl);

        cardHTML = `
          <img src="${pokemonData.pokemonImage}" alt="" class="pokemonImg">
          <p  class="pokemonName">${pokemonData.pokemonNameUpperCase}</p>
          <p class="pokemonId">${pokemonData.pokemonIdText}</p>
          <div class="power-container">
            <p class="pokemonType ${pokemonData.pokemonType}">${pokemonData.pokemonType}</p>`

        if(pokemonData.pokemonType2){
          cardHTML += `<p class="pokemonType2 ${pokemonData.pokemonType2}">${pokemonData.pokemonType2}</p>`

        }
        // Close the `power-container` div
        cardHTML += `</div>`
        // set the innerHTML of the pokemonDeckCardEl to the cardHTML
        pokemonDeckCardEl.innerHTML = cardHTML;
        
        // event listener to change page on click of a card
        pokemonDeckCardEl.addEventListener('click',function(){
          // window.location.href = 'pokemon-details.html';
        })

    }else{
      console.error(`Failed to load Pokémon with ID ${index}`);
    }}
    attachCardEventListeners();
}


// !Attach event listeners to the Pokémon cards
function attachCardEventListeners() {
  document.querySelectorAll('.pokemon-deck-card').forEach(card => {
    // Get the pokemonName element within each card
    const pokemonNameEl = card.querySelector('.pokemonName');
    pokemonNameEl.addEventListener('click', function () {
      // Retrieve data from the clicked card using dataset
      const id = card.dataset.id;
      const name = card.dataset.name;
      const type1 = card.dataset.type1;
      const type2 = card.dataset.type2;
      const src = card.dataset.src;

      // Log or use the data as needed
      console.log(`ID: ${id}, Name: ${name}, Type 1: ${type1}, Type 2: ${type2}, Image Src: ${src}`);

      // Redirect to pokedex-details.html with query parameters
      // Suppose you want to pass a Pokémon's name that includes special characters or spaces, like "Mr. Mime", as a query parameter in a URL. If you don't encode the string, the URL might break or produce unexpected results because characters like spaces, #, &, and ? have special meanings in URLs. Unsafe Characters: Characters such as &, =, ?, #, and spaces are replaced with their percent-encoded equivalents (%26, %3D, %3F, %23, %20, respectively).
      const url = `pokemon-details.html?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&type1=${encodeURIComponent(type1)}&type2=${encodeURIComponent(type2)}&src=${encodeURIComponent(src)}`;
      window.location.href = url;
    });
  });
}

// Call the populate function
populatePokemonCards();






// !Search functionality using pokemon name and id
document.getElementById('search-input').addEventListener('input', function(event){
  const searchValue = event.target.value.toLowerCase();
  const searchValue2NoFormat = event.target.value;
   // Format the search value to include the '#' and pad with leading zeros
   const searchValue2 = `#${String(searchValue2NoFormat).padStart(3, '0')}`;
  // get all pokemon decks 
  const pokemonDeckCards = document.querySelectorAll('.pokemon-deck-card');

  // Check if the input is empty
  if (searchValue === '') {
    // If the input is empty, show all cards
    pokemonDeckCards.forEach(function(card) {
      card.style.display = 'block';
    });
  } else {
    // in each pokemon deck get the pokemon name from the paragraph with class pokemonName and check if it includes the search value. So basically for each card in pokemonDeck execute this function
    // Loop through each card and display those that match the search value by name or number
      pokemonDeckCards.forEach(function(card) {
        const pokemonName = card.querySelector('.pokemonName').textContent.toLowerCase();
        const pokemonIdSearchInput = card.querySelector('.pokemonId').textContent;
        
        // Check if the search value matches either the name or the formatted ID
        if (pokemonName.includes(searchValue) || pokemonIdSearchInput.includes(searchValue2)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
})

// !Clear Input field
function clearInput(){
  document.getElementById('search-input').value = '';
  const pokemonDeckCards = document.querySelectorAll('.pokemon-deck-card');
  pokemonDeckCards.forEach(function(card){
    card.style.display = 'block';
  })
}

//! Sorting the cards 
function sortBy(){
  sortbyValue = document.getElementById('filter-by-number-name').value;
  console.log(`sortbyValue: ${sortbyValue}`);

  if (sortbyValue === '1'){
    sortPokemonCardsByLowestNumber();
  }
  if (sortbyValue === '2'){
    sortPokemonCardsByHighestNumber();
  }
  if (sortbyValue === '3'){
    sortPokemonCardsAtoZ();
  }
  if (sortbyValue === '4'){
    sortPokemonCardsZtoA();
  }
}
// sortBy();

//! function to sort the cards in alphabetical order
function sortPokemonCardsAtoZ(){
  // get all pokemon decks cards, a querySelectorAll returns a nodelist
  const pokemonDeckCardsAtoZ = document.querySelectorAll('.pokemon-deck-card');
  const pokemonDeckContainerAtoZEl = document.querySelector('.pokemon-deck-container');
  // Convert the NodeList to an array to perform array method `.sort()` and sort it alphabetically
  const pokemonDeckCardsArrayAtoZ = Array.from(pokemonDeckCardsAtoZ);
  pokemonDeckCardsArrayAtoZ.sort((a,b) => {
    const pokemonNameA = a.querySelector('.pokemonName').textContent;
    const pokemonNameB = b.querySelector('.pokemonName').textContent;
    console.log(`numberA: ${pokemonNameA}, numberB: ${pokemonNameB}`);
    // if(pokemonNameA < pokemonNameB){
    //   return -1;
    // } else {
    //   return 1;
    // }
    return pokemonNameA.localeCompare(pokemonNameB);
  });
  // Clear the container and re-append the sorted cards
  // pokemonDeckContainerAtoZEl.innerHTML = '';
  pokemonDeckCardsArrayAtoZ.forEach((card) => {
    pokemonDeckContainerAtoZEl.appendChild(card);
  });
}

//! function to sort the cards in reverse order
function sortPokemonCardsZtoA(){
  // get all pokemon decks cards, a querySelectorAll returns a nodelist
  const pokemonDeckCardsZtoA = document.querySelectorAll('.pokemon-deck-card');
  const pokemonDeckContainerZtoAEl = document.querySelector('.pokemon-deck-container');
  // Convert the NodeList to an array to perform array method `.sort()` and sort it alphabetically
  const pokemonDeckCardsArrayZtoA = Array.from(pokemonDeckCardsZtoA);
  pokemonDeckCardsArrayZtoA.sort((a,b) => {
    const pokemonNameA = a.querySelector('.pokemonName').textContent;
    const pokemonNameB = b.querySelector('.pokemonName').textContent;
    console.log(`numberA: ${pokemonNameA}, numberB: ${pokemonNameB}`);
    // if(pokemonNameA < pokemonNameB){
    //   return -1;
    // } else {
    //   return 1;
    // }
    // (referenceString).localeCompare(compareString), if the referenceString is less than the compareString [bulbasaur<Ivysaur], it returns  -1, so ivysaur is placed before bulbasaur. (notsure)
    return pokemonNameB.localeCompare(pokemonNameA);
  });
  // Clear the container and re-append the sorted cards
  pokemonDeckContainerZtoAEl.innerHTML = '';
  pokemonDeckCardsArrayZtoA.forEach((card) => {
    pokemonDeckContainerZtoAEl.appendChild(card);
  });
}

// !Function to sort the Pokémon cards by highest number
function sortPokemonCardsByHighestNumber() {
  const pokemonDeckContainerEl = document.querySelector('.pokemon-deck-container');
  const pokemonDeckCards = Array.from(document.querySelectorAll('.pokemon-deck-card'));

  // Sort the cards by the Pokémon number in descending order (highest to lowest)
  // a and b: These are two Pokémon cards (or elements) being compared.
  pokemonDeckCards.sort((a, b) => {
    // numberA and numberB: These are the ID numbers extracted from the Pokémon cards.
    const numberA = parseInt(a.querySelector('.pokemonId').textContent.replace('#', ''), 10);
    // .replace('#', ''): This method call removes the # symbol from the text content. The replace method is used to search for a specified substring (# in this case) and replace it with another substring (an empty string '' here).
    // parseInt(..., 10): After removing the #, parseInt converts the remaining string to an integer, using base 10 for the conversion. This is used to ensure that the Pokémon ID is treated as a number rather than a string.
    const numberB = parseInt(b.querySelector('.pokemonId').textContent.replace('#', ''), 10);
    console.log(`numberA: ${numberA}, numberB: ${numberB}`);
    // numberA: 2, numberB: 1, this returns a -1 meaning that Ivysaur (ID 2-A) should come before Bulbasaur (ID 1-B) in the sorted list.
    return numberB - numberA;
  });

  // Clear the container and re-append the sorted cards
  pokemonDeckContainerEl.innerHTML = '';
  pokemonDeckCards.forEach(card => pokemonDeckContainerEl.appendChild(card));
}

// !Function to sort the Pokémon cards by lowest number
function sortPokemonCardsByLowestNumber() {
  const pokemonDeckContainerEl = document.querySelector('.pokemon-deck-container');
  const pokemonDeckCards = Array.from(document.querySelectorAll('.pokemon-deck-card'));

 
  pokemonDeckCards.sort((a, b) => {
 
    const numberA = parseInt(a.querySelector('.pokemonId').textContent.replace('#', ''), 10);

    const numberB = parseInt(b.querySelector('.pokemonId').textContent.replace('#', ''), 10);
    console.log(`numberA: ${numberA}, numberB: ${numberB}`);
    return numberA - numberB;
  });

  // Clear the container and re-append the sorted cards
  pokemonDeckContainerEl.innerHTML = '';
  pokemonDeckCards.forEach(card => pokemonDeckContainerEl.appendChild(card));
}








