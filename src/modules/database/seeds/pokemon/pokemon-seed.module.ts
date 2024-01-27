import { Module } from '@nestjs/common'
import { PokemonSeedService } from 'src/modules/database/seeds/pokemon/pokemon-seed.service'

@Module({
  imports: [],
  providers: [PokemonSeedService],
  exports: [PokemonSeedService],
})
export class PokemonSeedModule {}
