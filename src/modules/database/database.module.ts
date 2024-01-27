import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { DatabaseConfigType } from 'src/config/database.config'

@Module({
  imports: [
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
export class DatabaseModule {}
