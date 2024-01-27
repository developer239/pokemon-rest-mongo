import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { EmailRegisterRequest } from 'src/modules/auth/dto/email-register.dto'
import { User, UserDocument } from 'src/modules/auth/schemas/user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async validateUserByEmailPassword(
    email: string,
    password: string
  ): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec()

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (isValidPassword) {
        return user
      }
    }

    return null
  }

  async validateUserById(userId: string) {
    const user = await this.userModel.findById(userId).exec()

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }

  login(user: UserDocument) {
    // eslint-disable-next-line no-underscore-dangle
    const payload = { id: user._id }
    const token = this.jwtService.sign(payload)

    return {
      accessToken: token,
      user,
    }
  }

  async register(input: EmailRegisterRequest) {
    const createdUser = new this.userModel(input)

    const user = await createdUser.save()

    return this.login(user)
  }
}
