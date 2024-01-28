import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export enum AttackCategory {
  FAST = 'fast',
  SPECIAL = 'special',
}

export class Attack {
  @Prop()
  name: string

  @Prop()
  type: string

  @Prop({ enum: AttackCategory })
  category: AttackCategory

  @Prop()
  damage: number
}

export class EvolutionRequirement {
  @Prop()
  amount: number

  @Prop()
  name: string
}

export type PokemonDocument = Pokemon & Document

@Schema({
  versionKey: false,
})
export class Pokemon {
  _id: string

  @Prop({ unique: true })
  number: number

  @Prop()
  name: string

  @Prop()
  classification: string

  @Prop([String])
  types: string[]

  @Prop([String])
  resistant: string[]

  @Prop([String])
  weaknesses: string[]

  @Prop(
    raw({
      minimum: { type: Number },
      maximum: { type: Number },
    })
  )
  weightRange: { minimum: number; maximum: number }

  @Prop(
    raw({
      minimum: { type: Number },
      maximum: { type: Number },
    })
  )
  heightRange: { minimum: number; maximum: number }

  @Prop({ type: Number })
  fleeRate: number

  @Prop()
  maxCP: number

  @Prop()
  maxHP: number

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  favoritedBy: Types.ObjectId[]

  @Prop([Attack])
  attacks: Attack[]

  @Prop(EvolutionRequirement)
  evolutionRequirements: EvolutionRequirement

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Pokemon' }] })
  evolutions: Types.ObjectId[]
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon)
