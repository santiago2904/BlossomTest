import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CharactersService } from './services/characters.service';
import { CharactersResolver } from './resolvers/characters.resolver';
import { RedisCacheModule } from '../../common/cache/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { CharacterRepository } from './repositories/character.repository';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CharactersUpdaterService } from './services/characters-updater.service';
import {
  ApiCharacterDataStrategy,
  DatabaseCharacterDataStrategy,
  CharacterDataStrategyFactory,
} from './strategies/character-data.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Character]),
    HttpModule,
    RedisCacheModule.register(),
    ScheduleModule.forRoot(),
  ],
  providers: [
    CharactersService,
    CharactersResolver,
    CharactersUpdaterService,
    ApiCharacterDataStrategy,
    DatabaseCharacterDataStrategy,
    CharacterDataStrategyFactory,
    {
      provide: CharacterRepository,
      useFactory: (dataSource: DataSource) => {
        return new CharacterRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [CharactersService],
})
export class CharactersModule {}
