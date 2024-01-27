import { Injectable } from '@nestjs/common'
import { ISeedService } from 'src/modules/database/seeds/services/seed.types'

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
  // eslint-disable-next-line
  constructor() {}

  async run() {
    // do something special
  }
}
