"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    });
    app.setGlobalPrefix('api');
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
    });
    app.use((req, res, next) => {
        console.log(`[Request] ${req.method} ${req.originalUrl}`);
        next();
    });
    app.use((err, req, res, next) => {
        if (err)
            console.error('[GlobalError]', err);
        next(err);
    });
    await app.listen(process.env.PORT || 3001);
    console.log(`🚀 Medivoy API running on http://localhost:${process.env.PORT || 3001}/api`);
    console.log(`📁 Static uploads: http://localhost:${process.env.PORT || 3001}/uploads/<filename>`);
}
bootstrap();
//# sourceMappingURL=main.js.map