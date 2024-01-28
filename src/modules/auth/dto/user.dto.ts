import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class User {
  @ApiProperty()
  @IsNotEmpty()
  readonly _id: string

  @ApiProperty()
  @IsNotEmpty()
  readonly email: string
}
