import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from 'src/modules/auth/schemas/user.schema'
import { ISeedService } from 'src/modules/database/seeds/services/seed.types'

@Injectable()
export class AuthSeedService implements ISeedService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async run() {
    const plainPassword = 'password1234'
    const email = 'michal@mail.com'

    await this.userModel.create({
      email,
      password: plainPassword,
    })

    Logger.log(
      `\x1b[34mCreated user with email: ${email} and password: ${plainPassword}`,
      'AuthSeedService'
    )
  }
}
