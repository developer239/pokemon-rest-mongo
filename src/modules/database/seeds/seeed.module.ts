import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { appConfig } from 'src/config/app.config'
import { authConfig } from 'src/config/auth.config'
import { databaseConfig, DatabaseConfigType } from 'src/config/database.config'
import { AuthSeedModule } from 'src/modules/database/seeds/auth/auth-seed.module'
import { PokemonSeedModule } from 'src/modules/database/seeds/pokemon/pokemon-seed.module'

@Module({
  imports: [
    PokemonSeedModule,
    AuthSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, authConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfigType>('database')
        return {
          uri: dbConfig!.mongodbUri,
        }
      },
    }),
  ],
})
export class SeedModule {}
