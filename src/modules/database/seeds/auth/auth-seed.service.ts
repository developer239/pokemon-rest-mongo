import { Injectable } from '@nestjs/common'
import { ISeedService } from 'src/modules/database/seeds/services/seed.types'

@Injectable()
export class AuthSeedService implements ISeedService {
  // eslint-disable-next-line
  constructor() {}

  async run() {
    // do something special
  }
}
