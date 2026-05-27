import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: true, credentials: true })
  app.setGlobalPrefix('api')
  app.use((req, res, next) => { console.log(`[Request] ${req.method} ${req.originalUrl}`); next() })
  app.use((err, req, res, next) => { if (err) console.error('[GlobalError]', err); next() })
  await app.listen(process.env.PORT || 3001)
  console.log(`🚀 Medivoy API running on http://localhost:${process.env.PORT || 3001}/api`)
}
bootstrap()
