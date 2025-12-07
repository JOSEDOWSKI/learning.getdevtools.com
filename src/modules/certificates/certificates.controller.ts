import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('course/:courseId')
  generateCourseCertificate(@Request() req, @Param('courseId') courseId: string) {
    return this.certificatesService.generateCourseCertificate(req.user.id, +courseId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('career/:careerId')
  generateNationalTitle(@Request() req, @Param('careerId') careerId: string) {
    return this.certificatesService.generateNationalTitle(req.user.id, +careerId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req, @Query('userId') userId?: string) {
    const targetUserId = req.user.role === 'super_admin' && userId ? +userId : req.user.id;
    return this.certificatesService.findAll(targetUserId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(+id);
  }

  @Get('verify/:hash')
  verify(@Param('hash') hash: string) {
    return this.certificatesService.verify(hash);
  }
}

