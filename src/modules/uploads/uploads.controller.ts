import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { UploadResponseDto, UploadMessageDto } from './dto/upload-response.dto';
import { UploadType } from './upload-config';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    userId: string;
    roles: string[];
  };
}

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('profile-photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload user profile photo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    req: AuthenticatedRequest,
  ) {
    return this.uploadsService.uploadFile(
      file,
      'profile_photo',
      req.user.userId,
    );
  }

  @Post('kyc-document')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload KYC/identity document' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadKycDocument(
    @UploadedFile() file: Express.Multer.File,
    req: AuthenticatedRequest,
  ) {
    return this.uploadsService.uploadFile(
      file,
      'kyc_document',
      req.user.userId,
    );
  }

  @Post('resume')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload resume (worker or service provider)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(
    @UploadedFile() file: Express.Multer.File,
    req: AuthenticatedRequest,
  ) {
    return this.uploadsService.uploadFile(file, 'resume', req.user.userId);
  }

  @Post('portfolio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload service provider portfolio images' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPortfolioImage(
    @UploadedFile() file: Express.Multer.File,
    req: AuthenticatedRequest,
  ) {
    return this.uploadsService.uploadFile(
      file,
      'portfolio_image',
      req.user.userId,
    );
  }

  @Post('business-logo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload employer business logo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadBusinessLogo(
    @UploadedFile() file: Express.Multer.File,
    req: AuthenticatedRequest,
  ) {
    return this.uploadsService.uploadFile(
      file,
      'business_logo',
      req.user.userId,
    );
  }

  @Post('listing-images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple listing images' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiResponse({ status: 201, type: [UploadResponseDto] })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadListingImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('listingId') listingId: string,
  ) {
    const entityId = listingId || 'pending';
    const results: { key: string; url: string }[] = [];
    for (const file of files) {
      const result = await this.uploadsService.uploadFile(
        file,
        'listing_image',
        entityId,
      );
      results.push(result);
    }
    return results;
  }

  @Post('report-evidence')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload report evidence/attachments' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadReportEvidence(
    @UploadedFile() file: Express.Multer.File,
    req: AuthenticatedRequest,
  ) {
    return this.uploadsService.uploadFile(
      file,
      'report_evidence',
      req.user.userId,
    );
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file from S3' })
  @ApiResponse({ status: 200, type: UploadMessageDto })
  async deleteFile(@Param('key') key: string) {
    await this.uploadsService.deleteFile(decodeURIComponent(key));
    return { message: 'File deleted successfully' };
  }

  @Post('image')
  @ApiOperation({ summary: 'Upload an image (generic, no auth)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', default: 'images' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string = 'images',
  ) {
    return this.uploadsService.uploadGenericFile(file, folder);
  }

  @Post('file')
  @ApiOperation({ summary: 'Upload a file (generic, no auth)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', default: 'files' },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string = 'files',
  ) {
    return this.uploadsService.uploadGenericFile(file, folder);
  }
}
