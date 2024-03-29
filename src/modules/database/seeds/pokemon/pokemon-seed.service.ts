import * as fs from 'fs'
import * as path from 'path'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ISeedService } from 'src/modules/database/seeds/services/seed.types'
import { Pokemon } from 'src/modules/pokemon/dto/pokemon.dto'
import { PokemonDocument } from 'src/modules/pokemon/schemas/pokemon.schema'

export interface IRawPokemon {
  'id': string
  'name': string
  'classification': string
  'types': string[]
  'resistant': string[]
  'weaknesses': string[]
  'weight': {
    minimum: string // kg
    maximum: string
  }
  'height': {
    minimum: string // m
    maximum: string
  }
  'fleeRate': number
  'evolutionRequirements': {
    amount: number
    name: string
  }
  'Previous evolution(s)'?: {
    id: string
    name: string
  }[]
  'evolutions'?: {
    id: string
    name: string
  }[]
  'maxCP': number
  'maxHP': number
  'attacks': {
    fast: {
      name: string
      type: string
      damage: number
    }[]
    special: {
      name: string
      type: string
      damage: number
    }[]
  }
}

@Injectable()
export class PokemonSeedService implements ISeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>
  ) {}

  async run() {
    const rawPokemons = this.loadRawPokemons()

    await this.insertPokemons(rawPokemons)
  }

  private loadRawPokemons(): IRawPokemon[] {
    const filePath = path.join(__dirname, '../../../../../pokemons.json')
    if (!fs.existsSync(filePath)) {
      throw new Error('File does not exist')
    }
    return JSON.parse(fs.readFileSync(filePath).toString()) as IRawPokemon[]
  }

  private insertPokemons(rawPokemons: IRawPokemon[]) {
    const pokemons = rawPokemons.map((rawPokemon) => {
      const pokemon = new this.pokemonModel({
        number: parseInt(rawPokemon.id, 10),
        name: rawPokemon.name,
        classification: rawPokemon.classification,
        types: rawPokemon.types,
        resistant: rawPokemon.resistant,
        weaknesses: rawPokemon.weaknesses,
        weightRange: {
          minimum: Math.round(parseFloat(rawPokemon.weight.minimum) * 100),
          maximum: Math.round(parseFloat(rawPokemon.weight.maximum) * 100),
        },
        heightRange: {
          minimum: Math.round(parseFloat(rawPokemon.height.minimum) * 100),
          maximum: Math.round(parseFloat(rawPokemon.height.maximum) * 100),
        },
        fleeRate: rawPokemon.fleeRate,
        maxCP: rawPokemon.maxCP,
        maxHP: rawPokemon.maxHP,
        attacks: [...rawPokemon.attacks.fast, ...rawPokemon.attacks.special],
        evolutionRequirements: rawPokemon.evolutionRequirements,
        evolutions: [
          ...(rawPokemon['Previous evolution(s)']?.map((item) => ({
            name: item.name,
            number: parseInt(item.id, 10),
          })) || []),
          ...(rawPokemon.evolutions?.map((item) => ({
            name: item.name,
            number: parseInt(item.id, 10),
          })) || []),
        ],
      })
      return pokemon.save()
    })

    return Promise.all(pokemons)
  }
}
