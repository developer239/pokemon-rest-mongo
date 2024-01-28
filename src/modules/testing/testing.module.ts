import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/modules/auth/schemas/user.schema'
import { UserTestingService } from 'src/modules/auth/services/user-testing.service'
import {
  Pokemon,
  PokemonSchema,
} from 'src/modules/pokemon/schemas/pokemon.schema'
import { PokemonTestingService } from 'src/modules/pokemon/services/pokemon-testing.service'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
  providers: [
    TestingEntityService,
    TestingDatabaseService,
    UserTestingService,
    PokemonTestingService,
  ],
  exports: [
    TestingEntityService,
    TestingDatabaseService,
    UserTestingService,
    PokemonTestingService,
  ],
})
export class TestingModule {}
