import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_CONFIG, UploadType } from './upload-config';

@Injectable()
export class UploadsService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION', 'ap-south-1'),
    });
    this.bucketName = this.configService.get(
      'AWS_S3_BUCKET',
      'localhire-assets',
    );
  }

  private validateFile(
    file: Express.Multer.File,
    uploadType: UploadType,
  ): void {
    const config = UPLOAD_CONFIG[uploadType];
    if (!config) {
      throw new BadRequestException(`Invalid upload type: ${uploadType}`);
    }

    const allowedTypes: string[] = config.allowedTypes as unknown as string[];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} not allowed. Allowed: ${allowedTypes.join(', ')}`,
      );
    }

    if (file.size > config.maxSize) {
      const maxSizeMB = (config.maxSize / 1024 / 1024).toFixed(1);
      throw new BadRequestException(
        `File size exceeds ${maxSizeMB}MB limit`,
      );
    }
  }

  private buildKey(
    uploadType: UploadType,
    entityId: string,
    file: Express.Multer.File,
  ): string {
    const config = UPLOAD_CONFIG[uploadType];
    const ext = file.originalname.split('.').pop() || 'bin';
    const uniqueName = `${entityId}-${uuidv4()}.${ext}`;
    return `${config.folder}/${uniqueName}`;
  }

  private buildUserKey(
    uploadType: UploadType,
    userId: string,
    userName: string,
    file: Express.Multer.File,
  ): string {
    const config = UPLOAD_CONFIG[uploadType];
    const ext = file.originalname.split('.').pop() || 'bin';
    const safeName = userName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const uniqueName = `${uuidv4()}.${ext}`;
    return `${userId}_${safeName}/${config.folder}/${uniqueName}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    uploadType: UploadType,
    entityId: string,
  ): Promise<{ key: string; url: string }> {
    this.validateFile(file, uploadType);
    const key = this.buildKey(uploadType, entityId, file);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION', 'ap-south-1')}.amazonaws.com/${key}`;
    return { key, url };
  }

  async uploadFileWithUserFolder(
    file: Express.Multer.File,
    uploadType: UploadType,
    userId: string,
    userName: string,
  ): Promise<{ key: string; url: string }> {
    this.validateFile(file, uploadType);
    const key = this.buildUserKey(uploadType, userId, userName, file);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION', 'ap-south-1')}.amazonaws.com/${key}`;
    return { key, url };
  }

  async uploadFileToUserFolder(
    file: Express.Multer.File,
    userId: string,
    userName: string,
  ): Promise<{ key: string; url: string }> {
    const ext = file.originalname.split('.').pop() || 'bin';
    const safeName = userName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const uniqueName = `${uuidv4()}.${ext}`;
    const key = `${userId}_${safeName}/${uniqueName}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION', 'ap-south-1')}.amazonaws.com/${key}`;
    return { key, url };
  }

  async uploadGenericFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<{ key: string; url: string }> {
    const key = `${folder}/${uuidv4()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION', 'ap-south-1')}.amazonaws.com/${key}`;
    return { key, url };
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
  }

  async deleteMultipleFiles(keys: string[]): Promise<void> {
    const deletePromises = keys.map((key) => this.deleteFile(key));
    await Promise.all(deletePromises);
  }
}
