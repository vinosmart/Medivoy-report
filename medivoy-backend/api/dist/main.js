"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: true, credentials: true });
    app.setGlobalPrefix('api');
    app.use((req, res, next) => { console.log(`[Request] ${req.method} ${req.originalUrl}`); next(); });
    app.use((err, req, res, next) => { if (err)
        console.error('[GlobalError]', err); next(); });
    await app.listen(process.env.PORT || 3001);
    console.log(`🚀 Medivoy API running on http://localhost:${process.env.PORT || 3001}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map