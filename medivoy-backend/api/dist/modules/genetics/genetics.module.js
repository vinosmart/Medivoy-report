"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const genetics_entity_1 = require("./entities/genetics.entity");
const genetics_service_1 = require("./genetics.service");
const genetics_controller_1 = require("./genetics.controller");
let GeneticsModule = class GeneticsModule {
};
exports.GeneticsModule = GeneticsModule;
exports.GeneticsModule = GeneticsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([genetics_entity_1.Genetics])],
        providers: [genetics_service_1.GeneticsService],
        controllers: [genetics_controller_1.GeneticsController],
    })
], GeneticsModule);
//# sourceMappingURL=genetics.module.js.map