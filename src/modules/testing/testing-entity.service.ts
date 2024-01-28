import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

@Injectable()
export class TestingEntityService {
  public async saveFixture<TEntity, TData>(
    model: Model<TEntity>,
    data: TData
  ): Promise<TEntity> {
    const instance = new model(data)

    await instance.save()

    const result = instance.toObject()
    // TODO: resolve typescript errors
    // @ts-ignore
    result._id = result._id.toString()

    return result as TEntity
  }
}
