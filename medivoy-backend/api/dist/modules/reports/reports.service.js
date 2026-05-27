"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("./entities/report.entity");
const ai_service_1 = require("../ai/ai.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ReportsService = class ReportsService {
    constructor(repo, aiService) {
        this.repo = repo;
        this.aiService = aiService;
    }
    async create(userId, title, type, fileUrl, forMember = '', filePath) {
        const report = this.repo.create({
            userId,
            title,
            type,
            fileUrl,
            forMember: forMember || '',
            status: 'processing',
        });
        const saved = await this.repo.save(report);
        this.processReport(saved.id, filePath || '', type).catch((err) => {
            console.error('processReport failed:', err);
        });
        return saved;
    }
    async processReport(reportId, filePath, type) {
        try {
            let ocrText = '';
            const markers = [];
            console.log('TYPE:', type);
            console.log('FILE PATH:', filePath);
            console.log('FILE EXISTS:', !!filePath && fs.existsSync(filePath));
            if (filePath && fs.existsSync(filePath)) {
                ocrText = await this.extractTextFromFile(filePath, type);
            }
            console.log('OCR LENGTH:', ocrText.length);
            console.log('OCR TEXT:', ocrText.slice(0, 1500));
            const result = await this.aiService.analyzeReport(ocrText, markers, type);
            const updatePayload = {
                status: 'done',
                riskScore: result.riskScore,
                summary: result.summary,
                recommendations: result.recommendations,
                findings: result.findings,
                extractedText: ocrText,
                markers: result.findings.map((f) => ({
                    name: f.label,
                    value: f.value,
                    unit: '',
                })),
            };
            await this.repo.update(reportId, updatePayload);
        }
        catch (err) {
            console.error('processReport error:', err);
            await this.repo.update(reportId, {
                status: 'error',
                summary: 'Failed to process report.',
            }).catch(() => { });
        }
    }
    async extractTextFromFile(filePath, type) {
        const ext = path.extname(filePath).toLowerCase();
        try {
            if (ext === '.pdf') {
                try {
                    const buffer = fs.readFileSync(filePath);
                    try {
                        const pdfParse = require('pdf-parse');
                        if (typeof pdfParse === 'function') {
                            const data = await pdfParse(buffer);
                            return data?.text || '';
                        }
                    }
                    catch (e) {
                        console.warn('classic pdf-parse failed, trying alt export...', e);
                    }
                    try {
                        const pdfModule = require('pdf-parse');
                        const PDFParse = pdfModule?.default || pdfModule?.PDFParse || null;
                        if (typeof PDFParse === 'function') {
                            try {
                                const parser = new PDFParse({ data: buffer });
                                if (typeof parser.getText === 'function') {
                                    const result = await parser.getText();
                                    return result?.text || result || '';
                                }
                                if (typeof parser.parse === 'function') {
                                    const result = await parser.parse();
                                    return result?.text || result || '';
                                }
                            }
                            catch (err) {
                                console.warn('class-based pdf-parse failed:', err);
                            }
                        }
                    }
                    catch (e) {
                        console.warn('alternate pdf-parse export failed:', e);
                    }
                    return `PDF parse failed: unsupported pdf-parse export for ${path.basename(filePath)}. Try installing pdf-parse@1.1.1`;
                }
                catch (err) {
                    console.error('pdf extraction failed:', err);
                    return `PDF parse failed: ${err?.message || 'unknown error'}`;
                }
            }
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                try {
                    const Tesseract = require('tesseract.js');
                    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
                    return text || '';
                }
                catch (err) {
                    console.error('tesseract failed:', err);
                    return `Image OCR failed: ${err?.message || 'Install tesseract.js'}`;
                }
            }
            if (ext === '.txt') {
                return fs.readFileSync(filePath, 'utf-8');
            }
        }
        catch (err) {
            console.error('extractTextFromFile failed:', err);
            return err?.message || '';
        }
        return '';
    }
    async findByUser(userId) {
        return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }
    async findOne(id, userId) {
        const report = await this.repo.findOne({ where: { id, userId } });
        if (!report)
            throw new common_1.HttpException('Report not found', 404);
        return report;
    }
    async update(id, updates) {
        await this.repo.update(id, updates);
        return this.repo.findOne({ where: { id } });
    }
    async remove(id, userId) {
        const report = await this.findOne(id, userId);
        await this.repo.delete(report.id);
        return { message: 'Report deleted successfully', id: report.id };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ai_service_1.AiService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map