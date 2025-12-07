import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { CreateCompanyAccessDto } from './dto/create-company-access.dto';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  grantAccess(@Body() createAccessDto: CreateAccessDto) {
    return this.accessService.grantAccess(createAccessDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':studentId/:courseId')
  revokeAccess(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.accessService.revokeAccess(+studentId, +courseId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyAccess(@Request() req) {
    return this.accessService.getStudentAccess(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check/:courseId')
  checkAccess(@Request() req, @Param('courseId') courseId: string) {
    return this.accessService.checkAccess(req.user.id, +courseId);
  }

  // Company Access
  @UseGuards(AuthGuard('jwt'))
  @Post('company')
  createCompanyAccess(@Body() createCompanyAccessDto: CreateCompanyAccessDto) {
    return this.accessService.createCompanyAccess(createCompanyAccessDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('company/:companyAccessId/assign/:studentId')
  assignCompanySeat(
    @Param('companyAccessId') companyAccessId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.accessService.assignCompanySeat(+companyAccessId, +studentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('company')
  findAllCompanyAccess() {
    return this.accessService.findAllCompanyAccess();
  }
}

