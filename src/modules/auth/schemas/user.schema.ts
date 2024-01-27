/* eslint-disable no-invalid-this */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Exclude } from 'class-transformer'
import mongoose, { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ unique: true, required: false })
  email: string

  @Exclude()
  @Prop({ required: false, select: false })
  password: string

  @Exclude()
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon' }],
    default: [],
  })
  favoritePokemons: mongoose.Types.ObjectId[]

  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(password, salt)
  }
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre<UserDocument>('save', async function setPassword(next) {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})
