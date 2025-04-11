import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCharacterIndexes1713219000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Índice para búsquedas por nombre (consulta más común)
    await queryRunner.query(`
      CREATE INDEX "idx_character_name" ON "characters" ("name");
    `);

    // Índice para búsquedas por estado
    await queryRunner.query(`
      CREATE INDEX "idx_character_status" ON "characters" ("status");
    `);

    // Índice para búsquedas por especie
    await queryRunner.query(`
      CREATE INDEX "idx_character_species" ON "characters" ("species");
    `);

    // Índice para búsquedas por género
    await queryRunner.query(`
      CREATE INDEX "idx_character_gender" ON "characters" ("gender");
    `);

    // Índice para búsquedas por origen
    await queryRunner.query(`
      CREATE INDEX "idx_character_origin" ON "characters" ("origin");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar todos los índices en orden inverso
    await queryRunner.query(`DROP INDEX "idx_character_origin"`);
    await queryRunner.query(`DROP INDEX "idx_character_gender"`);
    await queryRunner.query(`DROP INDEX "idx_character_species"`);
    await queryRunner.query(`DROP INDEX "idx_character_status"`);
    await queryRunner.query(`DROP INDEX "idx_character_name"`);
  }
}
