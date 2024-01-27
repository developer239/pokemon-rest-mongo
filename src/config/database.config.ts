import { ConfigType, registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const databaseConfigSchema = {
  MONGODB_URI: Joi.string().required(),
  MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
  MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
}

export const databaseConfig = registerAs('database', () => ({
  mongodbUri: process.env.MONGODB_URI,
  mongodbUsername: process.env.MONGO_INITDB_ROOT_USERNAME,
  mongodbPassword: process.env.MONGO_INITDB_ROOT_PASSWORD,
}))

export type DatabaseConfigType = ConfigType<typeof databaseConfig>
