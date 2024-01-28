import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDocument } from 'src/modules/auth/schemas/user.schema'
import { ListPokemonsQuery } from 'src/modules/pokemon/dto/list-pokemons-query.dto'
import {
  Pokemon,
  PokemonDocument,
} from 'src/modules/pokemon/schemas/pokemon.schema'
import { escapeRegex } from 'src/utils/escape-regex'

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>
  ) {}

  async addFavorite(id: string, user: UserDocument): Promise<PokemonDocument> {
    const pokemon = await this.pokemonModel.findById(id).exec()

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found')
    }

    if (!pokemon.favoritedBy.includes(user._id)) {
      pokemon.favoritedBy.push(user._id)
      await pokemon.save()
    }

    return pokemon
  }

  async removeFavorite(
    id: string,
    user: UserDocument
  ): Promise<PokemonDocument> {
    const pokemon = await this.pokemonModel.findById(id).exec()

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found')
    }

    const index = pokemon.favoritedBy.indexOf(user._id)
    if (index !== -1) {
      pokemon.favoritedBy.splice(index, 1)
      await pokemon.save()
    }

    return pokemon
  }

  async findByName(name: string): Promise<PokemonDocument> {
    const pokemon = await this.pokemonModel
      // resolved by escapeRegex
      // eslint-disable-next-line security/detect-non-literal-regexp
      .findOne({ name: new RegExp(escapeRegex(name), 'iu') })
      .exec()

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found')
    }

    return pokemon
  }

  async findById(id: string): Promise<PokemonDocument> {
    const pokemon = await this.pokemonModel.findById(id).exec()

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found')
    }

    return pokemon
  }

  findAllTypes(): Promise<string[]> {
    return this.pokemonModel.distinct('types').exec()
  }

  async findAll(
    query: ListPokemonsQuery,
    user?: UserDocument
  ): Promise<{ items: PokemonDocument[]; count: number }> {
    const { limit, offset, search, type, isFavorite } = query

    const filter: any = {}

    if (search) {
      // resolved by using escapeRegex
      // eslint-disable-next-line security/detect-non-literal-regexp
      filter.name = { $regex: new RegExp(escapeRegex(search), 'iu') }
    }

    if (type) {
      filter.types = type
    }

    if (isFavorite !== undefined) {
      if (!user) {
        throw new ForbiddenException(
          'Only authenticated users can filter by "isFavorite".'
        )
      }

      filter.favoritedBy = isFavorite ? user._id : { $ne: user._id }
    }

    const items = await this.pokemonModel
      .find(filter)
      .skip(offset || 0)
      .limit(limit || 10)
      .exec()

    const count = await this.pokemonModel.countDocuments(filter).exec()

    return { items, count }
  }
}
