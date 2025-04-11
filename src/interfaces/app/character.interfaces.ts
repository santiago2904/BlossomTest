/**
 * Interfaces para los personajes y sus filtros en la aplicación
 */

/**
 * Interfaz básica para un Personaje
 */
export interface ICharacter {
  id: number;
  name: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
  origin?: string;
  location?: string;
  image?: string;
  episode?: string[];
  url?: string;
  created?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interfaz para los filtros de búsqueda de personajes
 */
export interface ICharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
  origin?: string;
}

/**
 * Interfaz para la respuesta paginada de personajes
 */
export interface IPaginatedCharacters<T = ICharacter> {
  results: T[];
  count: number;
  next: string | null;
  prev: string | null;
} 