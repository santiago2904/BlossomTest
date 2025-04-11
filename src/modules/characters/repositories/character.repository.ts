import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Character } from '../entities/character.entity';

@Injectable()
export class CharacterRepository extends Repository<Character> {
  constructor(private dataSource: DataSource) {
    super(Character, dataSource.createEntityManager());
  }
} 