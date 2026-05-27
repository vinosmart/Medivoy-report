"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./modules/auth/auth.module");
const reports_module_1 = require("./modules/reports/reports.module");
const ai_module_1 = require("./modules/ai/ai.module");
const family_module_1 = require("./modules/family/family.module");
const orders_module_1 = require("./modules/orders/orders.module");
const profile_module_1 = require("./modules/profile/profile.module");
const genetics_module_1 = require("./modules/genetics/genetics.module");
const user_entity_1 = require("./modules/auth/entities/user.entity");
const report_entity_1 = require("./modules/reports/entities/report.entity");
const family_member_entity_1 = require("./modules/family/entities/family-member.entity");
const order_entity_1 = require("./modules/orders/entities/order.entity");
const profile_entity_1 = require("./modules/profile/entities/profile.entity");
const genetics_entity_1 = require("./modules/genetics/entities/genetics.entity");
const nutrition_module_1 = require("./modules/nutrition/nutrition.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                entities: [user_entity_1.User, report_entity_1.Report, family_member_entity_1.FamilyMember, order_entity_1.Order, profile_entity_1.Profile, genetics_entity_1.Genetics],
                synchronize: true,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            }),
            auth_module_1.AuthModule,
            reports_module_1.ReportsModule,
            ai_module_1.AiModule,
            family_module_1.FamilyModule,
            orders_module_1.OrdersModule,
            profile_module_1.ProfileModule,
            genetics_module_1.GeneticsModule,
            nutrition_module_1.NutritionModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map