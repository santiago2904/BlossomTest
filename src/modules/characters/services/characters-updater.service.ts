import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MeasureTime } from '../../../common/decorators/measure-time.decorator';
import { CharacterRepository } from '../repositories/character.repository';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { RickAndMortyCharacter } from '../../../interfaces/rick-and-morty/rick-and-morty.interfaces';

@Injectable()
export class CharactersUpdaterService {
  private readonly logger = new Logger(CharactersUpdaterService.name);
  private readonly apiUrl: string;

  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('rickAndMortyApi.url') || '';
  }

  /**
   * Tarea cron que se ejecuta cada 12 horas para actualizar los personajes en la base de datos
   */
  @Cron(CronExpression.EVERY_12_HOURS)
  @MeasureTime()
  async updateCharacters(): Promise<void> {
    this.logger.log('Iniciando actualización de personajes...');

    try {
      // Obtener los personajes de la base de datos
      const dbCharacters = await this.characterRepository.find();

      if (dbCharacters.length === 0) {
        this.logger.warn(
          'No hay personajes en la base de datos para actualizar',
        );
        return;
      }

      // Obtener los IDs de los personajes para consultar a la API
      const characterIds = dbCharacters.map((char) => char.id).join(',');

      // Hacer la consulta a la API para obtener la información actualizada
      const response = await firstValueFrom(
        this.httpService.get<RickAndMortyCharacter | RickAndMortyCharacter[]>(
          `${this.apiUrl}/character/${characterIds}`,
        ),
      );

      // Asegurarse de que la respuesta sea un array (incluso si solo hay un personaje)
      const apiCharacters: RickAndMortyCharacter[] = Array.isArray(
        response.data,
      )
        ? response.data
        : [response.data];

      // Actualizar cada personaje si hay cambios
      let updatedCount = 0;
      for (const apiChar of apiCharacters) {
        const dbChar = dbCharacters.find((c) => c.id === apiChar.id);

        if (!dbChar) continue;

        // Verificar si hay cambios comparando los campos relevantes
        if (
          dbChar.name !== apiChar.name ||
          dbChar.status !== apiChar.status ||
          dbChar.species !== apiChar.species ||
          dbChar.type !== apiChar.type ||
          dbChar.gender !== apiChar.gender ||
          dbChar.origin !== apiChar.origin.name ||
          dbChar.location !== apiChar.location.name ||
          dbChar.image !== apiChar.image
        ) {
          // Si hay cambios, actualizar el personaje
          const updatedChar = this.characterRepository.create({
            ...dbChar,
            name: apiChar.name,
            status: apiChar.status,
            species: apiChar.species,
            type: apiChar.type,
            gender: apiChar.gender,
            origin: apiChar.origin.name,
            location: apiChar.location.name,
            image: apiChar.image,
            episode: apiChar.episode,
            url: apiChar.url,
          });

          await this.characterRepository.save(updatedChar);
          updatedCount++;

          this.logger.debug(
            `Personaje actualizado: ${apiChar.name} (ID: ${apiChar.id})`,
          );
        }
      }

      this.logger.log(
        `Actualización completada. ${updatedCount} personajes actualizados.`,
      );
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Error al actualizar personajes: ${err.message}`,
        err.stack,
      );
    }
  }
}
