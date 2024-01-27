import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { Model } from 'mongoose'

type ValidationEntity =
  | {
      id?: number | string
    }
  | undefined

@Injectable()
@ValidatorConstraint({ name: 'DoesNotExist', async: true })
export class DoesNotExist implements ValidatorConstraintInterface {
  constructor(
    @InjectModel('User') private readonly userModel: Model<ValidationEntity>
  ) {}

  async validate(
    value: string,
    validationArguments: ValidationArguments
  ): Promise<boolean> {
    const currentValue = validationArguments.object as ValidationEntity

    const entity = await this.userModel
      .findOne({
        [validationArguments.property]: value,
      })
      .exec()

    // If the entity exists and the id is not the same as the current value's id, return false
    if (entity && String(entity.id) !== String(currentValue?.id)) {
      return false
    }

    // If the entity does not exist or the id is the same, return true
    return true
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} already exists`
  }
}
