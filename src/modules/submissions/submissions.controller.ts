import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionsService.create(req.user.id, createSubmissionDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    // Si es admin, mostrar todas; si no, solo las del usuario
    const studentId = req.user.role === 'super_admin' ? undefined : req.user.id;
    return this.submissionsService.findAll(studentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/evaluation')
  getEvaluation(@Param('id') id: string) {
    return this.submissionsService.getEvaluation(+id);
  }
}

