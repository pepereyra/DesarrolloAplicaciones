// Configuración de la API
const POKEMON_API_BASE = 'https://pokeapi.co/api/v2';
const POKEMON_COUNT = 150; // Número de Pokémon a cargar

// Referencias a elementos del DOM
const loadingDiv = document.getElementById('loading');
const tableBody = document.getElementById('pokemonTableBody');
const loadButton = document.getElementById('loadPokemon');
const clearButton = document.getElementById('clearTable');

/**
 * Función principal para cargar datos de Pokémon
 */
async function loadPokemonData() {
    try {
        showLoading(true);
        loadButton.disabled = true;
        
        // Limpiar tabla antes de cargar nuevos datos
        clearTable();
        
        // Obtener lista de Pokémon
        const pokemonList = await fetchPokemonList();
        
        // Obtener detalles de cada Pokémon
        const pokemonDetails = await Promise.all(
            pokemonList.map(pokemon => fetchPokemonDetails(pokemon.url))
        );
        
        // Renderizar los datos en la tabla
        renderPokemonTable(pokemonDetails);
        
        console.log('Datos de Pokémon cargados exitosamente');
        
    } catch (error) {
        console.error('Error al cargar datos de Pokémon:', error);
        showError('Error al cargar los datos de Pokémon. Por favor, intenta nuevamente.');
    } finally {
        showLoading(false);
        loadButton.disabled = false;
    }
}

/**
 * Obtiene la lista inicial de Pokémon
 */
async function fetchPokemonList() {
    const response = await fetch(`${POKEMON_API_BASE}/pokemon?limit=${POKEMON_COUNT}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
}

/**
 * Obtiene los detalles de un Pokémon específico
 */
async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const pokemon = await response.json(); 
    
    // Extraer y formatear la información relevante
    return {
        id: pokemon.id,
        name: capitalizeFirst(pokemon.name),
        image: pokemon.sprites.front_default || pokemon.sprites.front_shiny,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types.map(type => type.type.name),
        abilities: pokemon.abilities.map(ability => ability.ability.name)
    };
}

/**
 * Renderiza los datos de Pokémon en la tabla HTML
 */
function renderPokemonTable(pokemonData) {
    const tbody = document.getElementById('pokemonTableBody');
    
    pokemonData.forEach(pokemon => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pokemon.id}</td>
            <td>${pokemon.name}</td>
            <td>
                ${pokemon.image ? 
                    `<img src="${pokemon.image}" alt="${pokemon.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0yMCAzMEMxNC40NzcxIDMwIDEwIDI1LjUyMjkgMTAgMjBDMTAgMTQuNDc3MSAxNC40NzcxIDEwIDIwIDEwQzI1LjUyMjkgMTAgMzAgMTQuNDc3MSAzMCAyMEMzMCAyNS41MjI5IDI1LjUyMjkgMzAgMjAgMzBaIiBmaWxsPSIjZDdkN2Q3Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjhweCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gaW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='" />` 
                    : '<span>No imagen</span>'
                }
            </td>
            <td>${pokemon.height}</td>
            <td>${pokemon.weight}</td>
            <td>${renderTypes(pokemon.types)}</td>
            <td>${renderAbilities(pokemon.abilities)}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Renderiza los tipos de Pokémon con colores
 */
function renderTypes(types) {
    return types.map(type => 
        `<span class="type-badge type-${type}">${capitalizeFirst(type)}</span>`
    ).join(' ');
}

/**
 * Renderiza las habilidades del Pokémon
 */
function renderAbilities(abilities) {
    return abilities.map(ability => 
        `<span class="ability-badge">${capitalizeFirst(ability.replace('-', ' '))}</span>`
    ).join(' ');
}

/**
 * Capitaliza la primera letra de una cadena
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Muestra u oculta el indicador de carga
 */
function showLoading(show) {
    loadingDiv.classList.toggle('hidden', !show);
}

/**
 * Limpia el contenido de la tabla
 */
function clearTable() {
    tableBody.innerHTML = '';
}

/**
 * Muestra un mensaje de error
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #ff6b6b;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        margin: 1rem 0;
        text-align: center;
        animation: fadeIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    // Insertar antes de la tabla
    const tableContainer = document.querySelector('.table-container');
    tableContainer.parentNode.insertBefore(errorDiv, tableContainer);
    
    // Remover el mensaje después de 5 segundos
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Función que se ejecuta cuando la página se carga completamente
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada - TP3 Pokémon API');
    console.log('API utilizada: PokeAPI (https://pokeapi.co)');
    console.log('Haz clic en "Cargar Pokémon" para comenzar');
    
    // Agregar event listeners a los botones
    const loadPokemonButton = document.getElementById('loadPokemon');
    const clearTableButton = document.getElementById('clearTable');
    
    loadPokemonButton.addEventListener('click', loadPokemonData);
    clearTableButton.addEventListener('click', clearTable);
});

// Event listeners adicionales
document.addEventListener('keydown', function(event) {
    // Permitir cargar datos con la tecla Enter
    if (event.key === 'Enter' && !loadButton.disabled) {
        loadPokemonData();
    }
    
    // Permitir limpiar tabla con la tecla Escape
    if (event.key === 'Escape') {
        clearTable();
    }
});

// Agregar estilos para la animación de fadeIn
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
