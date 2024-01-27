import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PokemonSeedService } from 'src/modules/database/seeds/pokemon/pokemon-seed.service'
import {
  Pokemon,
  PokemonSchema,
} from 'src/modules/pokemon/schemas/pokemon.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
  providers: [PokemonSeedService],
  exports: [PokemonSeedService],
})
export class PokemonSeedModule {}
