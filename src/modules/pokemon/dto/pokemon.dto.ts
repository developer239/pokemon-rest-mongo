import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Attack } from 'src/modules/pokemon/dto/attack.dto'
import { EvolutionRequirement } from 'src/modules/pokemon/dto/evolution-requirement.dto'

export class Evolution {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  number: number
}

export class Pokemon {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  _id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  number: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  classification: string

  @ApiProperty({ type: [String] })
  @IsArray()
  types: string[]

  @ApiProperty({ type: [String] })
  @IsArray()
  resistant: string[]

  @ApiProperty({ type: [String] })
  @IsArray()
  weaknesses: string[]

  @ApiProperty()
  weightRange: { minimum: number; maximum: number }

  @ApiProperty()
  heightRange: { minimum: number; maximum: number }

  @ApiProperty()
  @IsNumber()
  fleeRate: number

  @ApiProperty()
  @IsInt()
  maxCP: number

  @ApiProperty()
  @IsInt()
  maxHP: number

  @ApiProperty({ type: [Attack] })
  attacks: Attack[]

  @ApiProperty({ type: EvolutionRequirement, required: false })
  evolutionRequirements: EvolutionRequirement

  @ApiProperty({
    type: [Evolution],
  })
  @IsArray()
  evolutions: Evolution[]
}
