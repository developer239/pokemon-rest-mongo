/* eslint-disable no-underscore-dangle */
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
    const pokemon = await this.pokemonModel.findOne({ name }).exec()

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

  async findAllTypes(): Promise<string[]> {
    const pokemons = await this.pokemonModel.find().select('types -_id').exec()
    // eslint-disable-next-line id-length
    const types = new Set(pokemons.flatMap((p) => p.types))
    return Array.from(types).sort()
  }

  async findAll(
    query: ListPokemonsQuery,
    user?: UserDocument
  ): Promise<{ items: PokemonDocument[]; count: number }> {
    const { limit, offset, search, type, isFavorite } = query

    const filter: any = {}

    if (search) {
      // eslint-disable-next-line require-unicode-regexp,security/detect-non-literal-regexp
      filter.name = new RegExp(search, 'i')
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
