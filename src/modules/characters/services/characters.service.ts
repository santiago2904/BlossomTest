import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Character } from '../entities/character.entity';
import {
  CharacterFilterInput,
  PaginatedCharacters,
} from '../dto/character.dto';
import { RedisCacheService } from '../../../common/cache/redis.module';
import { firstValueFrom } from 'rxjs';
import { Like, FindOptionsWhere } from 'typeorm';
import { AxiosResponse } from 'axios';
import { CharacterRepository } from '../repositories/character.repository';
import { MeasureTime } from '../../../common/decorators/measure-time.decorator';
import { CharacterDataStrategyFactory } from '../strategies/character-data.strategy';
import { RickAndMortyResponse } from '../../../interfaces/rick-and-morty/rick-and-morty.interfaces';

@Injectable()
export class CharactersService {
  private readonly apiUrl: string;
  private readonly logger = new Logger(CharactersService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly charactersRepository: CharacterRepository,
    private readonly redisCacheService: RedisCacheService,
    private readonly configService: ConfigService,
    private readonly dataStrategyFactory: CharacterDataStrategyFactory,
  ) {
    this.apiUrl = this.configService.get<string>('rickAndMortyApi.url') || '';
  }

  @MeasureTime()
  async findAll(filter?: CharacterFilterInput): Promise<Character[]> {
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

    return this.charactersRepository.find({ where });
  }

  @MeasureTime()
  async findById(id: number): Promise<Character | null> {
    return this.charactersRepository.findOneBy({ id });
  }

  @MeasureTime()
  async searchCharacters(
    filter?: CharacterFilterInput,
    useApiStrategy: boolean = true,
  ): Promise<PaginatedCharacters> {
    try {
      const strategy = this.dataStrategyFactory.createStrategy(useApiStrategy);
      return await strategy.getCharacters(filter);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Error getting characters: ${err.message}`,
        err.stack,
      );

      if (useApiStrategy) {
        this.logger.log('Falling back to database strategy');
        return this.searchCharacters(filter, false);
      }

      return {
        results: [],
        count: 0,
        next: null,
        prev: null,
      };
    }
  }

  @MeasureTime()
  async populateInitialCharacters(): Promise<void> {
    const count = await this.charactersRepository.count();

    if (count === 0) {
      try {
        const response: AxiosResponse<RickAndMortyResponse> =
          await firstValueFrom(
            this.httpService.get(`${this.apiUrl}/character?page=1`),
          );

        const characters = response.data.results
          .slice(0, 15)
          .map(
            ({
              id,
              name,
              status,
              species,
              type,
              gender,
              origin: { name: originName },
              location: { name: locationName },
              image,
              episode,
              url,
              created,
            }) => ({
              id,
              name,
              status,
              species,
              type,
              gender,
              origin: originName,
              location: locationName,
              image,
              episode,
              url,
              created: new Date(created),
            }),
          );

        await this.charactersRepository.save(characters);
        this.logger.log('Database seeding completed successfully');
      } catch (error: unknown) {
        const err = error as Error;
        this.logger.error('Error populating initial characters:', err.stack);
      }
    }
  }
}
