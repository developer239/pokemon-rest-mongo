/* eslint-disable @typescript-eslint/no-use-before-define */
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { rand, randNumber, randSuperheroName } from '@ngneat/falso'
import { Model } from 'mongoose'
import {
  AttackCategory,
  Pokemon,
  PokemonDocument,
} from 'src/modules/pokemon/schemas/pokemon.schema'
import { randMultiple } from 'src/modules/testing/helpers'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Injectable()
export class PokemonTestingService extends TestingEntityService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>
  ) {
    super()
  }

  public createPokemonData(data?: Partial<IPokemonTestData>): IPokemonTestData {
    return {
      number: randNumber({ min: 1, max: 10000 }),
      name: randSuperheroName(),
      classification: rand(dummyClassification),
      types: randMultiple(dummyTypes),
      resistant: randMultiple(dummyResistant),
      weaknesses: randMultiple(dummyWeaknesses),
      weightRange: {
        minimum: randNumber({ min: 1, max: 100 }),
        maximum: randNumber({ min: 100, max: 10000 }),
      },
      heightRange: {
        minimum: randNumber({ min: 1, max: 100 }),
        maximum: randNumber({ min: 100, max: 10000 }),
      },
      fleeRate: randNumber({ min: 0, max: 1, fractionDigits: 2 }),
      maxCP: randNumber({ min: 1, max: 10000 }),
      maxHP: randNumber({ min: 1, max: 10000 }),
      ...data,
    }
  }

  public createPokemonAttackData(
    data?: Partial<IPokemonAttackTestData>
  ): IPokemonAttackTestData {
    return {
      name: randSuperheroName(),
      type: rand(dummyTypes),
      category: rand(Object.values(AttackCategory)),
      damage: randNumber({ min: 1, max: 1000 }),
      ...data,
    }
  }

  public createEvolutionRequirementData(
    data?: Partial<IEvolutionRequirementTestData>
  ): IEvolutionRequirementTestData {
    return {
      amount: randNumber({ min: 1, max: 100 }),
      name: randSuperheroName(),
      ...data,
    }
  }

  public async createTestPokemon(
    data?: Partial<IPokemonTestData>,
    relations?: IPokemonTestDataRelations
  ): Promise<{ pokemon: Pokemon }> {
    const pokemonData = this.createPokemonData(data)

    const attacks = [
      this.createPokemonAttackData({ category: AttackCategory.FAST }),
      this.createPokemonAttackData({ category: AttackCategory.FAST }),
      this.createPokemonAttackData({ category: AttackCategory.FAST }),
      this.createPokemonAttackData({ category: AttackCategory.SPECIAL }),
    ]

    const evolutionRequirements = this.createEvolutionRequirementData()

    const favoritedByIds = (relations?.favoritedBy ?? []).map(
      (id) => new this.pokemonModel.base.Types.ObjectId(id)
    )

    const pokemon = await this.saveFixture(this.pokemonModel, {
      ...pokemonData,
      attacks,
      evolutionRequirements,
      favoritedBy: favoritedByIds,
    })

    return { pokemon }
  }

  public async createTestPokemonCount(count: number): Promise<Pokemon[]> {
    const pokemons: Pokemon[] = []

    await Promise.all(
      Array(count)
        .fill(0)
        .map(async () => {
          const { pokemon } = await this.createTestPokemon()
          pokemons.push(pokemon)
        })
    )

    return pokemons
  }
}

// TODO: possibly split into multiple files

const dummyClassification = [
  'Bivalve',
  'Butterfly',
  'ClassyCat',
  'Drill',
  'Fairy',
  'FireHorse',
  'Fish',
  'Flame',
  'Gas',
  'Genetic',
]

const dummyTypes = ['Electric', 'Ground', 'Poison', 'Water', 'Bug', 'Fighting']
const dummyResistant = dummyTypes
const dummyWeaknesses = dummyTypes

interface IPokemonTestData {
  number: number
  name: string
  classification: string
  types: string[]
  resistant: string[]
  weaknesses: string[]
  weightRange: { minimum: number; maximum: number }
  heightRange: { minimum: number; maximum: number }
  fleeRate: number
  maxCP: number
  maxHP: number
  favoritedBy?: number[]
}

interface IPokemonTestDataRelations {
  favoritedBy?: string[]
}

interface IPokemonAttackTestData {
  name: string
  type: string
  category: AttackCategory
  damage: number
}

interface IEvolutionRequirementTestData {
  amount: number
  name: string
}
