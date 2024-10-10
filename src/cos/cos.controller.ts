import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CosService } from './cos.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cos')
export class CosController {
  constructor(private readonly cosService: CosService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.cosService.uploadFile(file);
    return { fileUrl };
  }
}
