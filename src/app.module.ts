import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import configuration from './config/configuration';
import { CharactersModule } from './modules/characters/characters.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    // Configuration module setup
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database module
    DatabaseModule,

    // GraphQL setup
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),

    // Feature modules
    CharactersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
