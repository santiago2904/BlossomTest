/**
 * Interfaces para la API de Rick and Morty
 */

/**
 * Interfaz para ubicaciones (origin y location)
 */
export interface RickAndMortyLocation {
  name: string;
  url: string;
}

/**
 * Interfaz para un personaje de Rick and Morty
 */
export interface RickAndMortyCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: RickAndMortyLocation;
  location: RickAndMortyLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

/**
 * Interfaz para la información de paginación
 */
export interface RickAndMortyInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/**
 * Interfaz para la respuesta completa de la API
 */
export interface RickAndMortyResponse {
  info: RickAndMortyInfo;
  results: RickAndMortyCharacter[];
}
