import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from './characters.service';
import { CharacterRepository } from '../repositories/character.repository';
import { HttpService } from '@nestjs/axios';
import { RedisCacheService } from '../../../common/cache/redis.module';
import { ConfigService } from '@nestjs/config';
import { CharacterDataStrategyFactory } from '../strategies/character-data.strategy';

// Mock para CharacterRepository
const mockCharacterRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  count: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

// Mock para HttpService
const mockHttpService = {
  get: jest.fn(),
};

// Mock para ConfigService
const mockConfigService = {
  get: jest.fn(),
};

// Mock para RedisCacheService
const mockRedisCacheService = {
  get: jest.fn(),
  set: jest.fn(),
};

// Mock para CharacterDataStrategyFactory
const mockStrategyFactory = {
  createStrategy: jest.fn(),
};

describe('CharactersService', () => {
  let service: CharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: CharacterRepository,
          useValue: mockCharacterRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: RedisCacheService,
          useValue: mockRedisCacheService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CharacterDataStrategyFactory,
          useValue: mockStrategyFactory,
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    mockConfigService.get.mockReturnValue('https://rickandmortyapi.com/api');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchCharacters', () => {
    const mockPaginatedResult = {
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          type: '',
          gender: 'Male',
          origin: 'Earth',
          location: 'Earth',
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          episode: ['https://rickandmortyapi.com/api/episode/1'],
          url: 'https://rickandmortyapi.com/api/character/1',
          created: new Date('2017-11-04T18:48:46.250Z'),
        },
      ],
      count: 1,
      next: null,
      prev: null,
    };

    it('should use API strategy by default', async () => {
      // Arrange
      const mockStrategy = {
        getCharacters: jest.fn().mockResolvedValue(mockPaginatedResult),
      };
      mockStrategyFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act
      const result = await service.searchCharacters();

      // Assert
      expect(mockStrategyFactory.createStrategy).toHaveBeenCalledWith(true);
      expect(mockStrategy.getCharacters).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should return empty result when both strategies fail', async () => {
      // Arrange
      const mockStrategy = {
        getCharacters: jest.fn().mockRejectedValue(new Error('Strategy Error')),
      };
      mockStrategyFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act?
      const result = await service.searchCharacters(undefined, false);

      // Assert
      expect(result).toEqual({
        results: [],
        count: 0,
        next: null,
        prev: null,
      });
    });
  });
});
