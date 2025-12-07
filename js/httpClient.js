// URL base de tu backend Node.js
const API_BASE_URL = 'http://localhost:3000';

/**
 * Obtiene el token de autenticación del almacenamiento local.
 * En una aplicación real, se manejaría de forma más segura.
 * @returns {string | null} El token JWT.
 */
function getAuthToken() {
    // Asume que el token se guarda en localStorage.
    // Asegúrate de implementarlo en tu lógica de login.
    return localStorage.getItem('authToken'); 
}

/**
 * Lanza un error con un mensaje personalizado basado en la respuesta HTTP.
 * @param {Response} response - El objeto Response de fetch.
 * @throws {Error} Error con mensaje personalizado.
 */
async function handleErrorResponse(response) {
    let errorData;
    try {
        // Intenta parsear la respuesta JSON para obtener el mensaje de error del backend
        errorData = await response.json();
    } catch (e) {
        // Si falla el parseo, el error es desconocido
        throw new Error(`Error ${response.status}: Respuesta del servidor no válida.`);
    }

    const message = errorData.message || `Error desconocido del servidor (Código: ${response.status}).`;

    switch (response.status) {
        case 400:
            throw new Error(`[ERROR 400 - Datos Inválidos] ${message}`);
        case 401:
            throw new Error(`[ERROR 401 - No Autorizado] ${message}. Por favor, inicia sesión de nuevo.`);
        case 404:
            throw new Error(`[ERROR 404 - No Encontrado] ${message}`);
        case 409:
            throw new Error(`[ERROR 409 - Conflicto] ${message}`);
        case 500:
            throw new Error(`[ERROR 500 - Servidor] ${message}. Inténtalo más tarde.`);
        default:
            throw new Error(`[ERROR HTTP] ${message}`);
    }
}

/**
 * Cliente HTTP genérico para manejar peticiones API.
 * @param {string} endpoint - La ruta específica del endpoint (e.g., '/games/complete').
 * @param {string} method - El método HTTP (e.g., 'GET', 'POST').
 * @param {object} [body=null] - El cuerpo de la solicitud para métodos POST/PUT.
 * @returns {Promise<object>} Los datos de la respuesta JSON del servidor.
 * @throws {Error} Si la petición falla o el servidor devuelve un código de error.
 */
export async function httpClient(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    // Encabezados predeterminados
    const headers = {
        'Content-Type': 'application/json',
    };

    // Agregar el token de autenticación si existe
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
    };

    // Agregar cuerpo para POST/PUT
    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Si la respuesta no es 2xx, lanza un error con el manejo personalizado
            await handleErrorResponse(response);
        }

        // Si es 2xx y tiene contenido, intenta parsear. Si es un 204 (No Content), devuelve un objeto vacío.
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return { message: 'Operación realizada con éxito.' };
        }

    } catch (error) {
        // Re-lanza el error manejado o un error de red
        console.error('Error en la conexión o procesamiento:', error);
        throw error;
    }
}