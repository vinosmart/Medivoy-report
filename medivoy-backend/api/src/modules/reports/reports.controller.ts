import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ReportsService } from './reports.service'

const allowedMimeTypes = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/bmp',
]

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private svc: ReportsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.svc.findByUser(req.user.userId)
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.svc.findOne(id, req.user.userId)
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
          cb(null, `${unique}${extname(file.originalname).toLowerCase()}`)
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true)
          return
        }

        cb(
          new BadRequestException(
            'Only PDF, PNG, JPG, JPEG, WEBP, BMP files are allowed',
          ) as any,
          false,
        )
      },
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async upload(@Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const { title, type, forMember } = req.body
    const fileUrl = `/uploads/${file.filename}`
    const filePath = join(process.cwd(), 'uploads', file.filename)

    return this.svc.create(
      req.user.userId,
      title || file.originalname,
      type || 'blood',
      fileUrl,
      forMember || '',
      filePath,
    )
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.svc.remove(id, req.user.userId)
  }
}