const API_URL = 'https://api.rawg.io/api/games?key=4ab08587e05946d99ed0b63a5732be3f&search=Metal%20Gear%20Solid';

async function obtenerJuegosMetalGearSolid() {
    const contenedorJuegos = document.getElementById('juegos');

    try {
        console.log('Realizando llamada a la API...');
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        console.log('Datos obtenidos de la API:', datos);

        if (datos.results.length === 0) {
            contenedorJuegos.innerHTML = '<p>No se encontraron juegos de Metal Gear Solid.</p>';
            return;
        }

        // Limpiar contenido anterior
        contenedorJuegos.innerHTML = '';

        datos.results.forEach(juego => {
            const juegoCard = document.createElement('div');
            juegoCard.classList.add('card');

            juegoCard.innerHTML = `
                <img src="${juego.background_image}" alt="${juego.name}">
                <div class="contenido-card">
                    <h3>${juego.name}</h3>
                    <p>Rating: ${juego.rating}</p>
                    <p>Fecha de lanzamiento: ${juego.released}</p>
                </div>
            `;

            contenedorJuegos.appendChild(juegoCard);
        });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        contenedorJuegos.innerHTML = '<p>Error al cargar los juegos. Inténtalo más tarde.</p>';
    }
}

document.addEventListener('DOMContentLoaded', obtenerJuegosMetalGearSolid);

