import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CharactersService } from './modules/characters/services/characters.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initial database population
  try {
    const charactersService = app.get(CharactersService);
    await charactersService.populateInitialCharacters();
  } catch (error) {
    console.error('Failed to populate characters:', error);
  }

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
