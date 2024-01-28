import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { GetUserPayload } from 'src/modules/auth/decorators/user.decorator'
import { EmailLoginResponse } from 'src/modules/auth/dto/email-login.dto'
import { EmailRegisterRequest } from 'src/modules/auth/dto/email-register.dto'
import { Me } from 'src/modules/auth/dto/me.dto'
import { UserDocument } from 'src/modules/auth/schemas/user.schema'
import { AuthService } from 'src/modules/auth/services/auth.service'

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(public service: AuthService) {}

  @Post()
  @ApiCreatedResponse({
    type: EmailLoginResponse,
  })
  register(@Body() createUserDto: EmailRegisterRequest) {
    return this.service.register(createUserDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Me,
  })
  @ApiUnauthorizedResponse()
  public me(@GetUserPayload() user: UserDocument) {
    return user
  }
}
