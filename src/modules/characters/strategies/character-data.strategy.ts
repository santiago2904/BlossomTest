import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CharacterRepository } from '../repositories/character.repository';
import { RedisCacheService } from '../../../common/cache/redis.module';
import { ConfigService } from '@nestjs/config';
import {
  CharacterFilterInput,
  PaginatedCharacters,
} from '../dto/character.dto';
import { Character } from '../entities/character.entity';
import { Like, FindOptionsWhere } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { MeasureTime } from '../../../common/decorators/measure-time.decorator';
import { RickAndMortyResponse } from '../../../interfaces/rick-and-morty/rick-and-morty.interfaces';

/**
 * Interfaz que define la estrategia para obtener datos de personajes
 */
export interface CharacterDataStrategy {
  getCharacters(filter?: CharacterFilterInput): Promise<PaginatedCharacters>;
}

/**
 * Estrategia para obtener datos de personajes desde la API externa
 */
@Injectable()
export class ApiCharacterDataStrategy implements CharacterDataStrategy {
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    this.apiUrl = this.configService.get<string>('rickAndMortyApi.url') || '';
  }

  @MeasureTime()
  async getCharacters(
    filter?: CharacterFilterInput,
  ): Promise<PaginatedCharacters> {
    // Generate a cache key based on the filter
    const cacheKey = filter
      ? `characters:${JSON.stringify(filter)}`
      : 'characters:all';

    // Check if data is in cache
    const cachedData = await this.redisCacheService.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData) as PaginatedCharacters;
    }

    // Build the query parameters for the Rick and Morty API
    const params: Record<string, string> = {};
    if (filter) {
      if (filter.name) params.name = filter.name;
      if (filter.status) params.status = filter.status;
      if (filter.species) params.species = filter.species;
      if (filter.gender) params.gender = filter.gender;
      // Origin is not directly supported by the API, but we'll handle it on our side
    }

    // Fetch data from the Rick and Morty API
    const response = await firstValueFrom(
      this.httpService.get<RickAndMortyResponse>(`${this.apiUrl}/character`, {
        params,
      }),
    );

    let results = response.data.results;

    // Filter by origin if provided, since the API doesn't support this directly
    if (filter?.origin) {
      results = results.filter((character) =>
        character.origin.name
          .toLowerCase()
          .includes(filter.origin?.toLowerCase() || ''),
      );
    }

    // Map the API response to our PaginatedCharacters format
    const paginatedResult: PaginatedCharacters = {
      results: results.map((char) => ({
        id: char.id,
        name: char.name,
        status: char.status,
        species: char.species,
        type: char.type,
        gender: char.gender,
        origin: char.origin.name,
        location: char.location.name,
        image: char.image,
        episode: char.episode,
        url: char.url,
        created: new Date(char.created),
      })),
      count: response.data.info.count,
      next: response.data.info.next,
      prev: response.data.info.prev,
    };

    // Store the result in cache with a 1-hour TTL
    await this.redisCacheService.set(
      cacheKey,
      JSON.stringify(paginatedResult),
      3600,
    );

    return paginatedResult;
  }
}

/**
 * Estrategia para obtener datos de personajes desde la base de datos local
 */
@Injectable()
export class DatabaseCharacterDataStrategy implements CharacterDataStrategy {
  constructor(private readonly characterRepository: CharacterRepository) {}

  @MeasureTime()
  async getCharacters(
    filter?: CharacterFilterInput,
  ): Promise<PaginatedCharacters> {
    const where: FindOptionsWhere<Character> = {};

    if (filter) {
      if (filter.name) {
        where.name = Like(`%${filter.name}%`);
      }
      if (filter.status) {
        where.status = filter.status;
      }
      if (filter.species) {
        where.species = filter.species;
      }
      if (filter.gender) {
        where.gender = filter.gender;
      }
      if (filter.origin) {
        where.origin = Like(`%${filter.origin}%`);
      }
    }

    const characters = await this.characterRepository.find({ where });

    return {
      results: characters,
      count: characters.length,
      next: null,
      prev: null,
    };
  }
}

/**
 * Factory para crear estrategias de datos de personajes
 */
@Injectable()
export class CharacterDataStrategyFactory {
  constructor(
    private readonly apiStrategy: ApiCharacterDataStrategy,
    private readonly dbStrategy: DatabaseCharacterDataStrategy,
  ) {}

  createStrategy(preferApi: boolean = true): CharacterDataStrategy {
    return preferApi ? this.apiStrategy : this.dbStrategy;
  }
}
