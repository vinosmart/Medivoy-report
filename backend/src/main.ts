import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // app.enableCors({
  //   // origin: [
  //   //   'http://localhost:3000',
  //   //   'http://localhost:3001',
  //   //   'http://127.0.0.1:3000',
  //   //   'http://127.0.0.1:3001',
  //   //   'http://192.106.1.3:3000',
  //   //   'http://192.168.1.3:3001',
  //   //   'http://192.168.1.13:3000',
  //   //   'http://192.168.1.13:3001',
  //   //   'https://6edd-2401-4900-893b-fa75-6d7f-1b4e-ba1c-8abf.ngrok-free.app'
  //   // ],
  //   origin: true,
  //   credentials: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   allowedHeaders: 'Content-Type, Authorization, Accept, Origin, X-Requested-With',
  // })
  app.enableCors({
    // Reflects the request origin dynamically, allowing any ngrok URL
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept, Origin, X-Requested-With, ngrok-skip-browser-warning',
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