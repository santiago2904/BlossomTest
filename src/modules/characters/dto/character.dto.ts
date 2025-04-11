import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
export class CharacterType {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  species: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  gender: string;

  @Field({ nullable: true })
  origin: string;

  @Field({ nullable: true })
  location: string;

  @Field({ nullable: true })
  image: string;

  @Field(() => [String], { nullable: true })
  episode: string[];

  @Field({ nullable: true })
  url: string;

  @Field({ nullable: true })
  created: Date;
}

@InputType()
export class CharacterFilterInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  species?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  origin?: string;
}

@ObjectType()
export class PaginatedCharacters {
  @Field(() => [CharacterType])
  results: CharacterType[];

  @Field(() => Number)
  count: number;

  @Field(() => String, { nullable: true })
  next: string | null;

  @Field(() => String, { nullable: true })
  prev: string | null;
}
