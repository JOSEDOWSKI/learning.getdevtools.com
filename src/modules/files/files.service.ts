import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private readonly uploadPath: string;
  private readonly maxFileSize: number = 500 * 1024 * 1024; // 500MB para videos
  private readonly maxPdfSize: number = 50 * 1024 * 1024; // 50MB para PDFs

  constructor(private configService: ConfigService) {
    // Usar /app/uploads en producción (Docker) o ./uploads en desarrollo
    this.uploadPath = process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads');
    this.ensureUploadDirectories();
  }

  private ensureUploadDirectories() {
    const videosPath = path.join(this.uploadPath, 'videos');
    const pdfsPath = path.join(this.uploadPath, 'pdfs');

    [videosPath, pdfsPath].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  validateFile(file: Express.Multer.File, type: 'video' | 'pdf'): void {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (type === 'video') {
      const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Tipo de archivo no permitido. Solo se permiten videos (mp4, webm, ogg, mov)',
        );
      }
      if (file.size > this.maxFileSize) {
        throw new BadRequestException(
          `El archivo es demasiado grande. Tamaño máximo: ${this.maxFileSize / 1024 / 1024}MB`,
        );
      }
    } else if (type === 'pdf') {
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Solo se permiten archivos PDF');
      }
      if (file.size > this.maxPdfSize) {
        throw new BadRequestException(
          `El archivo es demasiado grande. Tamaño máximo: ${this.maxPdfSize / 1024 / 1024}MB`,
        );
      }
    }
  }

  saveFile(file: Express.Multer.File, type: 'video' | 'pdf'): { url: string; filename: string } {
    this.validateFile(file, type);

    const subfolder = type === 'video' ? 'videos' : 'pdfs';
    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedOriginalName}`;
    const filePath = path.join(this.uploadPath, subfolder, filename);

    fs.writeFileSync(filePath, file.buffer);

    // En producción, la URL será servida por el servidor estático
    const url = `/api/files/${subfolder}/${filename}`;
    return { url, filename };
  }

  deleteFile(filename: string, type: 'video' | 'pdf'): void {
    const subfolder = type === 'video' ? 'videos' : 'pdfs';
    const filePath = path.join(this.uploadPath, subfolder, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getFilePath(filename: string, type: 'video' | 'pdf'): string {
    const subfolder = type === 'video' ? 'videos' : 'pdfs';
    return path.join(this.uploadPath, subfolder, filename);
  }
}

