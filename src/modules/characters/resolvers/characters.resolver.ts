import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { CharactersService } from '../services/characters.service';
import {
  CharacterType,
  CharacterFilterInput,
  PaginatedCharacters,
} from '../dto/character.dto';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => CharacterType)
export class CharactersResolver {
  constructor(private readonly charactersService: CharactersService) {}

  @Query(() => CharacterType, { nullable: true })
  async character(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<CharacterType> {
    const character = await this.charactersService.findById(id);
    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }
    return character;
  }

  @Query(() => [CharacterType])
  async charactersFromDb(
    @Args('filter', { nullable: true }) filter?: CharacterFilterInput,
  ): Promise<CharacterType[]> {
    return this.charactersService.findAll(filter);
  }

  @Query(() => PaginatedCharacters)
  async characters(
    @Args('filter', { nullable: true }) filter?: CharacterFilterInput,
  ): Promise<PaginatedCharacters> {
    return this.charactersService.searchCharacters(filter);
  }
}
