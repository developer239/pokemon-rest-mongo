import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/modules/auth/schemas/user.schema'
import { AuthSeedService } from 'src/modules/database/seeds/auth/auth-seed.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthSeedService],
  exports: [AuthSeedService],
})
export class AuthSeedModule {}
