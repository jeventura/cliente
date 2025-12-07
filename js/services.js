import { httpClient } from './httpClient.js';

// --- Servicios de Juego y Cuartos (gameController) ---

// --- Servicios de Autenticación y Registro ---

/**
 * [ENDPOINT 1] Registra un nuevo participante.
 * @param {string} nombre - Nombre del jugador.
 * @param {string} apellido - Apellido del jugador.
 * @param {string} apodo - Apodo único del jugador.
 * @param {string} correo - Correo electrónico único del jugador.
 * @returns {Promise<object>} Token JWT y playerId.
 */
export async function registerPlayerService(nombre, apellido, apodo, correo) {
    const body = { nombre, apellido, apodo, correo };
    return await httpClient(
        '/auth/register',
        'POST',
        body
    );
}

/**
 * [ENDPOINT 2]  (Asumido) Crea un nuevo grupo administrativo.
 * Se asume que 'Grupo' y 'Cuarto' son entidades separadas.
 * @param {string} nombre_grupo - Nombre del nuevo grupo.
 * @returns {Promise<object>} Detalles del grupo creado.
 */
export async function createGroupService(nombre_grupo) {
    const body = { nombre_grupo: nombre_grupo};
    return await httpClient(
        '/groups/create', // Ruta asumida para la creación de Grupos
        'POST',
        body
    );
}

/**
 * [ENDPOINT 2]  (Asumido) vincularse a un nuevo grupo.
 * Se asume que 'Grupo' y 'Cuarto' son entidades separadas.
 * @param {string} nombre_grupo - Nombre del nuevo grupo.
 * @param {string} codigo_grupo - Código único para el nuevo grupo.
 * @returns {Promise<object>} Detalles del grupo creado.
 */
export async function joinGroupService(codigo_vinculacion) {
    const body = { codigo_vinculacion: codigo_vinculacion};
    return await httpClient(
        '/groups/join', // Ruta asumida para la creación de Grupos
        'POST',
        body
    );

/**
 * [ENDPOINT 3] Marca un juego como completado y actualiza el puntaje.
 * @param {string} codigo_juego - Código del juego completado.
 * @param {number} tiempo_jugado - Tiempo total jugado en segundos.
 * @param {boolean} flag_ganado - Indica si el jugador ganó o completó con puntos.
 * @param {string} [img=null] - Imagen Base64 opcional de la evidencia.
 * @returns {Promise<object>} El puntaje actual del jugador.
 */
export async function completeGameService(codigo_juego, tiempo_jugado, flag_ganado, img = null) {
    const body = {
        codigo_juego,
        tiempo_jugado,
        flag_ganado,
    };

    // Añadir la imagen solo si está presente
    if (img) {
        body.img = img;
    }

    return await httpClient(
        '/games/complete',
        'POST',
        body
    );
}

/**
 * [ENDPOINT 4] Obtiene el estado completo del jugador (datos, cuartos, juegos).
 * @returns {Promise<object>} Datos completos del estado del jugador.
 */
export async function getPlayerStatusService() {
    return await httpClient('/status', 'GET');
}

/**
 * [ENDPOINT 6] Obtiene el puntaje final del participante.
 * @returns {Promise<object>} El apodo y puntaje final.
 */
export async function getFinalScoreService() {
    return await httpClient('/score/final', 'GET');
}


// --- Servicios de Ranking (rankController) ---

/**
 * [ENDPOINT 5] Obtiene el ranking de puntajes para un grupo (cuarto) específico.
 * @param {string} codigo_cuarto - Código del cuarto para el ranking.
 * @returns {Promise<object>} Lista de jugadores rankeados.
 */
export async function getRoomRankingService(codigo_cuarto) {
    return await httpClient(`/ranking/group/${codigo_cuarto}`, 'GET');
}

/**
 * [ENDPOINT 7] Obtiene el ranking de puntajes total de todos los jugadores.
 * @returns {Promise<object>} Lista de jugadores rankeados globalmente.
 */
export async function getGlobalRankingService() {
    return await httpClient('/ranking/global', 'GET');
}