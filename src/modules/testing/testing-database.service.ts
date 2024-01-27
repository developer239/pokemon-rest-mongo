/* eslint-disable no-await-in-loop */
import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

@Injectable()
export class TestingDatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  public async clearDb() {
    const collections = await this.connection.db.collections()
    for (const collection of collections) {
      await collection.deleteMany({})
    }
  }
}
