import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as COS from 'cos-nodejs-sdk-v5';

@Injectable()
export class CosService {
  private cos: any;

  constructor(private configService: ConfigService) {
    this.cos = new COS({
      SecretId: this.configService.get('cos.SecretId'),
      SecretKey: this.configService.get('cos.SecretKey'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: this.configService.get('cos.Bucket'),
          Region: this.configService.get('cos.Region'),
          Key: file.originalname,
          Body: file.buffer,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.Location);
          }
        },
      );
    });
  }

  // 可以添加其他方法,如删除文件、获取文件列表等
}