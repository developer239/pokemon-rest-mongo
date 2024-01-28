import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/modules/auth/schemas/user.schema'
import { UserTestingService } from 'src/modules/auth/services/user-testing.service'
import { TestingDatabaseService } from 'src/modules/testing/testing-database.service'
import { TestingEntityService } from 'src/modules/testing/testing-entity.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [TestingEntityService, TestingDatabaseService, UserTestingService],
  exports: [TestingEntityService, TestingDatabaseService, UserTestingService],
})
export class TestingModule {}
