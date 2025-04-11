import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCharacters1713219000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "characters" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "status" VARCHAR NULL,
        "species" VARCHAR NULL,
        "type" VARCHAR NULL,
        "gender" VARCHAR NULL,
        "origin" VARCHAR NULL,
        "location" VARCHAR NULL,
        "image" VARCHAR NULL,
        "episode" TEXT[] DEFAULT '{}',
        "url" VARCHAR NULL,
        "created" TIMESTAMP NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "characters"`);
  }
}
