import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId } from 'class-validator'

export class IDParamDTO {
  @ApiProperty({
    description: 'Id',
    required: true,
    type: String,
    example: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId()
  id: string
}
