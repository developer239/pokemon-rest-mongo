/* eslint-disable no-await-in-loop */
import { NestFactory } from '@nestjs/core'
import { getConnectionToken } from '@nestjs/mongoose'
import { Connection } from 'mongoose'
import { AuthSeedService } from 'src/modules/database/seeds/auth/auth-seed.service'
import { PokemonSeedService } from 'src/modules/database/seeds/pokemon/pokemon-seed.service'
import { SeedModule } from 'src/modules/database/seeds/seeed.module'

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule)

  const connection = app.get<Connection>(getConnectionToken())
  const collections = await connection.db.collections()
  for (const collection of collections) {
    await collection.drop()
  }

  await app.get(PokemonSeedService).run()
  await app.get(AuthSeedService).run()

  await app.close()
}

void runSeed()
