import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept, Origin, X-Requested-With',
  })

  app.setGlobalPrefix('api')

  // Serve uploaded files as public static assets at /uploads/*
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  })

  app.use((req: any, res: any, next: any) => {
    console.log(`[Request] ${req.method} ${req.originalUrl}`)
    next()
  })

  app.use((err: any, req: any, res: any, next: any) => {
    if (err) console.error('[GlobalError]', err)
    next(err)
  })

  await app.listen(process.env.PORT || 3001)
  console.log(`🚀 Medivoy API running on http://localhost:${process.env.PORT || 3001}/api`)
  console.log(`📁 Static uploads: http://localhost:${process.env.PORT || 3001}/uploads/<filename>`)
}

bootstrap()