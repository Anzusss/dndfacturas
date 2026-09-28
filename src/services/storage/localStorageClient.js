/**
 * @file Cliente mínimo de localStorage con serialización JSON.
 *
 * Capa: SERVICIOS / INFRAESTRUCTURA. Los servicios usan este cliente en lugar
 * de tocar `localStorage` directamente; cuando exista el backend NestJS bastará
 * con sustituir estas llamadas por peticiones HTTP dentro de cada servicio.
 */

export const localStorageClient = {
  /**
   * Lee y parsea una clave. Devuelve `null` si no existe, si el JSON está
   * corrupto o si el navegador bloquea el acceso (modo privado, etc.).
   *
   * @param {string} key
   * @returns {any|null}
   */
  read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error(`Error al leer "${key}" de localStorage:`, error);
      return null;
    }
  },

  /**
   * Serializa y guarda un valor. Los errores (cuota llena, acceso bloqueado)
   * se registran en consola y se relanzan para que la UI pueda informar.
   *
   * @param {string} key
   * @param {any} value
   */
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error al escribir "${key}" en localStorage:`, error);
      throw error;
    }
  },
};
