import { Module } from '@nestjs/common'
import { AuthSeedService } from 'src/modules/database/seeds/auth/auth-seed.service'

@Module({
  imports: [],
  providers: [AuthSeedService],
  exports: [AuthSeedService],
})
export class AuthSeedModule {}
