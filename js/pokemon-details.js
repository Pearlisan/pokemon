


 // Function to get query parameters from URL
function getQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    id: urlParams.get('id'),
    name: urlParams.get('name'),
    type1: urlParams.get('type1'),
    type2: urlParams.get('type2'),
    src: urlParams.get('src')
  };
}

// Function to render the Pokémon details
function renderPokemonDetails() {
  const params = getQueryParams();
  // console.log(params.id);

  // Set the innerHTML or attributes of the elements with the data
  // document.querySelector('.pokemonName-detailpage').textContent = params.name;
  // document.querySelector('.pokemonId-detailpage').textContent = params.id;
  // document.querySelector('.type-detailpage1').textContent = `${params.type1}`;
  // document.querySelector('.type-detailpage2').textContent = params.type2 ? `${params.type2}` : '';
  // document.querySelector('.pokemon-img-detail-page').src = params.src;
}

// Call the render function on page load
window.onload = renderPokemonDetails;


    
//! Define an async function to fetch data from the API
async function fetchPokemon(pokemonId) {
  try {
    // Await the fetch response
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
    const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);

    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Await the conversion of the response to JSON
    const data = await response.json();
    const data2 = await response2.json();
    const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const pokemonType1 = data.types[0].type.name;
    let pokemonType2 = '';  // Initialize an empty string for the second type

    // Check if a second type exists
    if (data.types[1]) {
      pokemonType2 = data.types[1].type.name;
    }
    const pokemonImg = data.sprites.other['official-artwork'].front_default;
    const pokemonHp = data.stats[0].base_stat;
    const pokemonAttack = data.stats[1].base_stat;
    const pokemonDefense = data.stats[2].base_stat;
    const pokemonSpecialAttack = data.stats[3].base_stat;
    const pokemonSpecialDefense = data.stats[4].base_stat;
    const pokemonSpeed = data.stats[5].base_stat;
    const flavorText = data2.flavor_text_entries[0].flavor_text;

    // Convert weight to kg and height to meters with one decimal place
    const pokemonWeight = (data.weight / 10).toFixed(1) + ' kg';
    const pokemonHeight = (data.height / 10).toFixed(1) + ' m';

  
     // Capitalize the first letter of abilities
     const pokemonAbilities1 = data.abilities[0].ability.name.charAt(0).toUpperCase() + data.abilities[0].ability.name.slice(1);
     const pokemonAbilities2 = data.abilities[1] ? data.abilities[1].ability.name.charAt(0).toUpperCase() + data.abilities[1].ability.name.slice(1) : '';


    // Return the data
    return {
      pokemonName,
      src: pokemonImg,
      pokemonHp,
      pokemonAttack,
      pokemonDefense,
      pokemonSpecialAttack,
      pokemonSpecialDefense,
      pokemonSpeed,
      pokemonWeight,
      pokemonHeight,
      pokemonAbilities1,
      pokemonAbilities2,
      pokemonType1,
      pokemonType2,
      flavorText
    };

  } catch (error) {
    // Catch and log any errors
    console.error('Error fetching the Pokémon:', error);
  }
}

async function renderPokemonStats() {
  const params = getQueryParams();
  // console.log(params.id);
  const index = parseInt(params.id.replace('#', ''),10);
  console.log(index);
  const parameters =  await fetchPokemon(index);
  console.log(parameters);

  document.querySelector('.pokemonName-detailpage').textContent = parameters.pokemonName;
  document.querySelector('.pokemonId-detailpage').textContent = params.id;
  document.querySelector('.type-detailpage1').textContent = `${parameters.pokemonType1}`;
  document.querySelector('.type-detailpage2').textContent = parameters.pokemonType2 ? `${parameters.pokemonType2}` : '';

  // Check if the Pokémon has a second type if not assign display none to the second type p tag
  if (!parameters.pokemonType2) {
    document.querySelector('.type-detailpage2').style.display = 'none';
  }

  document.querySelector('.pokemon-img-detail-page').src = parameters.src;

  // Set the innerHTML or attributes of the elements with the data
  document.querySelector('.hpNumber').textContent = parameters.pokemonHp.toString().padStart(3, '0');
  document.querySelector('.pokemonAttack').textContent = parameters.pokemonAttack.toString().padStart(3, '0');
  document.querySelector('.pokemonDefense').textContent = parameters.pokemonDefense.toString().padStart(3, '0');
  document.querySelector('.pokemonSpecialAttack').textContent = parameters.pokemonSpecialAttack.toString().padStart(3, '0');
  document.querySelector('.pokemonSpecialDefense').textContent = parameters.pokemonSpecialDefense.toString().padStart(3, '0');
  document.querySelector('.pokemonSpeed').textContent = parameters.pokemonSpeed.toString().padStart(3, '0');
  
    // Calculate the width percentage for the stat bars
    const hpWidth = `${parameters.pokemonHp}%`;
    const attackWidth = `${parameters.pokemonAttack}%`;
    const defenseWidth = `${parameters.pokemonDefense}%`;
    const specialAttackWidth = `${parameters.pokemonSpecialAttack}%`;
    const specialDefenseWidth = `${parameters.pokemonSpecialDefense}%`;
    const speedWidth = `${parameters.pokemonSpeed}%`;
  
    // Set the width of the filled bars using inline CSS
    document.querySelector('.hp-filled').style.width = hpWidth;
    document.querySelector('.atk-filled').style.width = attackWidth;
    document.querySelector('.def-filled').style.width = defenseWidth;
    document.querySelector('.sp-atk-filled').style.width = specialAttackWidth;
    document.querySelector('.sp-def-filled').style.width = specialDefenseWidth;
    document.querySelector('.speed-filled').style.width = speedWidth;

    document.querySelector('.pokemonWeight').textContent = parameters.pokemonWeight;
    document.querySelector('.pokemonHeight').textContent = parameters.pokemonHeight;
    document.querySelector('.ability1').textContent =parameters. pokemonAbilities1;
    document.querySelector('.ability2').textContent = parameters.pokemonAbilities2;

    document.querySelector('.pokemon-flavortext').textContent = parameters.flavorText;
  // document.querySelector('.pokemonType').textContent = pokemonType;
}
renderPokemonStats();

document.getElementById('back-button').addEventListener('click', () => {
  window.history.back();
});