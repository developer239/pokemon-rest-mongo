import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PokemonController } from 'src/modules/pokemon/controllers/pokemon.controller'
import {
  Pokemon,
  PokemonSchema,
} from 'src/modules/pokemon/schemas/pokemon.schema'
import { PokemonService } from 'src/modules/pokemon/services/pokemon.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService],
})
export class PokemonModule {}
