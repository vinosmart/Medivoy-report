"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const reports_service_1 = require("./reports.service");
const allowedMimeTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/bmp',
];
let ReportsController = class ReportsController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll(req) {
        return this.svc.findByUser(req.user.userId);
    }
    findOne(req, id) {
        return this.svc.findOne(id, req.user.userId);
    }
    async upload(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const { title, type, forMember } = req.body;
        const fileUrl = `/uploads/${file.filename}`;
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', file.filename);
        return this.svc.create(req.user.userId, title || file.originalname, type || 'blood', fileUrl, forMember || '', filePath);
    }
    remove(req, id) {
        return this.svc.remove(id, req.user.userId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (_, file, cb) => {
                const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `${unique}${(0, path_1.extname)(file.originalname).toLowerCase()}`);
            },
        }),
        fileFilter: (_req, file, cb) => {
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
                return;
            }
            cb(new common_1.BadRequestException('Only PDF, PNG, JPG, JPEG, WEBP, BMP files are allowed'), false);
        },
        limits: { fileSize: 20 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "remove", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map