import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { randEmail, randPassword } from '@ngneat/falso'
import { Model } from 'mongoose'
import { User, UserDocument } from 'src/modules/auth/schemas/user.schema'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Injectable()
export class UserTestingService extends TestingEntityService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {
    super()
  }

  public createUserData() {
    return {
      email: randEmail(),
      password: randPassword(),
    }
  }

  public async createTestUser(): Promise<{
    user: User
    meta: { plainPassword: string }
  }> {
    const { email, password } = this.createUserData()

    const user = await this.saveFixture(this.userModel, {
      email,
      password,
    })

    return {
      user,
      meta: {
        plainPassword: password,
      },
    }
  }

  public async createTestUsers(count: number): Promise<User[]> {
    const users: User[] = []

    await Promise.all(
      Array.from({ length: count }, async () => {
        const { user } = await this.createTestUser()
        users.push(user)
      })
    )

    return users
  }

  public async createAuthenticatedUser(
    jwtService: JwtService,
    shouldNotSerialize = false
  ): Promise<{ user: User; accessToken: string }> {
    const { user } = await this.createTestUser()

    const accessToken = jwtService.sign({ id: (user as any)._id })

    if (shouldNotSerialize) {
      return {
        user,
        accessToken,
      }
    }

    return {
      user,
      accessToken,
    }
  }
}
