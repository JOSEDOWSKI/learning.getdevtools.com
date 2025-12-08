import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FilesService } from './files.service';
import { CoursesService } from '../courses/courses.service';
import * as path from 'path';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly coursesService: CoursesService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('lessons/:lessonId/video')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @Param('lessonId') lessonId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const lessonIdNum = parseInt(lessonId, 10);
    if (isNaN(lessonIdNum) || lessonIdNum <= 0) {
      throw new BadRequestException('ID de lección inválido');
    }

    const { url, filename } = this.filesService.saveFile(file, 'video');
    const professorId = req.user.sub;

    // Actualizar la lección con la URL del video
    const lesson = await this.coursesService.updateLessonFile(
      lessonIdNum,
      'video',
      url,
      filename,
      professorId,
    );

    return {
      message: 'Video subido exitosamente',
      url: lesson.video_url,
      filename: lesson.video_filename,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('lessons/:lessonId/pdf')
  @UseInterceptors(FileInterceptor('pdf'))
  async uploadPdf(
    @Param('lessonId') lessonId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const lessonIdNum = parseInt(lessonId, 10);
    if (isNaN(lessonIdNum) || lessonIdNum <= 0) {
      throw new BadRequestException('ID de lección inválido');
    }

    const { url, filename } = this.filesService.saveFile(file, 'pdf');
    const professorId = req.user.sub;

    // Actualizar la lección con la URL del PDF
    const lesson = await this.coursesService.updateLessonFile(
      lessonIdNum,
      'pdf',
      url,
      filename,
      professorId,
    );

    return {
      message: 'PDF subido exitosamente',
      url: lesson.pdf_url,
      filename: lesson.pdf_filename,
    };
  }

  @Get('videos/:filename')
  async getVideo(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.filesService.getFilePath(filename, 'video');
    const uploadPath = this.filesService['uploadPath'];
    
    // Validar que el archivo existe y está dentro del directorio permitido
    if (!filePath.startsWith(uploadPath)) {
      throw new BadRequestException('Ruta de archivo inválida');
    }

    res.sendFile(path.resolve(filePath), {
      headers: {
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      },
    });
  }

  @Get('pdfs/:filename')
  async getPdf(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.filesService.getFilePath(filename, 'pdf');
    const uploadPath = this.filesService['uploadPath'];
    
    // Validar que el archivo existe y está dentro del directorio permitido
    if (!filePath.startsWith(uploadPath)) {
      throw new BadRequestException('Ruta de archivo inválida');
    }

    res.sendFile(path.resolve(filePath), {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
  }
}

