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
const tesseract_js_1 = require("tesseract.js");
const pdfParse = __importStar(require("pdf-parse"));
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
        this.processReport(saved.id, filePath || '', type).catch((err) => console.error('processReport failed:', err));
        return saved;
    }
    async processReport(reportId, filePath, type) {
        try {
            let extractedText = '';
            if (filePath && fs.existsSync(filePath)) {
                extractedText = await this.extractTextFromFile(filePath);
            }
            if (!extractedText || extractedText.trim().length < 20) {
                const fallback = await this.readFallbackText(reportId, filePath);
                if (fallback)
                    extractedText = fallback;
            }
            const normalizedType = String(type || '').toLowerCase();
            console.log('[processReport] reportId:', reportId);
            console.log('[processReport] filePath:', filePath);
            console.log('[processReport] type:', normalizedType);
            console.log('[processReport] extractedText length:', extractedText?.length || 0);
            const markers = normalizedType === 'dna'
                ? this.extractDnaFindingsAsMarkers(extractedText)
                : normalizedType === 'blood'
                    ? this.extractBloodMarkersFromText(extractedText)
                    : [];
            console.log('[processReport] markers length:', markers.length);
            const result = await this.aiService.analyzeReport(extractedText, markers, type);
            const fallbackMarkers = markers.length > 0
                ? markers
                : result.findings?.map((f) => ({
                    name: f.label,
                    value: f.value,
                    unit: '',
                })) || [];
            const updatePayload = {
                status: 'done',
                riskScore: result.overallHealthScore ?? 70,
                summary: result.summary || '',
                recommendations: result.recommendations || {
                    diet: [],
                    exercise: [],
                    sleep: [],
                    supplements: [],
                    followUp: [],
                },
                findings: result.findings || [],
                extractedText: extractedText || '',
                markers: fallbackMarkers,
            };
            if (this.hasColumn('confidenceScore')) {
                updatePayload.confidenceScore = result.confidenceScore ?? 0;
            }
            if (this.hasColumn('reportType')) {
                updatePayload.reportType = result.reportType || type;
            }
            if (this.hasColumn('overallHealthScore')) {
                updatePayload.overallHealthScore = result.overallHealthScore ?? 70;
            }
            if (this.hasColumn('longTermInsights')) {
                updatePayload.longTermInsights = result.longTermInsights || [];
            }
            if (this.hasColumn('fiveYearAnswers')) {
                updatePayload.fiveYearAnswers = result.fiveYearAnswers || [];
            }
            if (this.hasColumn('riskCategories')) {
                updatePayload.riskCategories = result.riskCategories || {};
            }
            if (this.hasColumn('keyInsights')) {
                updatePayload.keyInsights = result.keyInsights || [];
            }
            if (this.hasColumn('positiveFindings')) {
                updatePayload.positiveFindings = result.positiveFindings || [];
            }
            if (this.hasColumn('criticalFindings')) {
                updatePayload.criticalFindings = result.criticalFindings || [];
            }
            if (this.hasColumn('missingImportantMarkers')) {
                updatePayload.missingImportantMarkers = result.missingImportantMarkers || [];
            }
            if (this.hasColumn('patternAnalysis')) {
                updatePayload.patternAnalysis = result.patternAnalysis || [];
            }
            if (this.hasColumn('dnaTraits')) {
                updatePayload.dnaTraits = result.dnaTraits || [];
            }
            if (this.hasColumn('warnings')) {
                updatePayload.warnings = result.warnings || [];
            }
            await this.repo.update(reportId, updatePayload);
        }
        catch (err) {
            console.error('processReport error:', err);
            await this.repo
                .update(reportId, {
                status: 'error',
                summary: 'Failed to process report.',
            })
                .catch(() => { });
        }
    }
    hasColumn(column) {
        return !!this.repo.metadata.columns.find((c) => c.propertyName === column);
    }
    async readFallbackText(reportId, filePath) {
        const report = await this.repo.findOne({ where: { id: reportId } });
        const candidates = [
            filePath,
            report?.fileUrl ? path.join(process.cwd(), report.fileUrl.replace(/^\//, '')) : '',
            report?.fileUrl || '',
        ].filter(Boolean);
        for (const candidate of candidates) {
            try {
                if (candidate && fs.existsSync(candidate)) {
                    const ext = path.extname(candidate).toLowerCase();
                    if (ext === '.pdf' || ['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'].includes(ext)) {
                        continue;
                    }
                    const text = fs.readFileSync(candidate, 'utf8');
                    if (text && text.trim().length > 20)
                        return text;
                }
            }
            catch (err) {
                console.warn('[readFallbackText] failed for:', candidate, err);
            }
        }
        return '';
    }
    extractBloodMarkersFromText(text) {
        const lines = String(text || '')
            .split(/\n+/)
            .map((l) => l.replace(/\s+/g, ' ').trim())
            .filter(Boolean);
        const defs = [
            { name: 'Hemoglobin', labels: ['hemoglobin', 'haemoglobin', 'hb'] },
            { name: 'WBC', labels: ['wbc', 'white blood cell', 'total wbc count', 'tlc'] },
            { name: 'RBC', labels: ['rbc', 'red blood cell'] },
            { name: 'Platelets', labels: ['platelet count', 'platelets'] },
            { name: 'Glucose', labels: ['fasting plasma glucose', 'fasting glucose', 'glucose', 'blood sugar', 'rbs', 'fbs'] },
            { name: 'TSH', labels: ['tsh'] },
            { name: 'AST', labels: ['ast', 'sgot'] },
            { name: 'ALT', labels: ['alt', 'sgpt'] },
            { name: 'Cholesterol', labels: ['cholesterol', 'total cholesterol'] },
            { name: 'LDL Cholesterol', labels: ['ldl cholesterol', 'ldl'] },
            { name: 'HDL Cholesterol', labels: ['hdl cholesterol', 'hdl'] },
            { name: 'Triglycerides', labels: ['triglycerides', 'tg'] },
            { name: 'Vitamin D', labels: ['vitamin d', '25-oh vitamin d', '25 hydroxy vitamin d'] },
            { name: 'Vitamin B12', labels: ['vitamin b12', 'b12'] },
            { name: 'Ferritin', labels: ['ferritin'] },
            { name: 'hs-CRP', labels: ['hs-crp', 'hs crp', 'crp'] },
            { name: 'Creatinine', labels: ['creatinine'] },
            { name: 'HbA1c', labels: ['hba1c', 'glycated hemoglobin'] },
        ];
        const skipLine = (line) => /^(page no|barcode no|report released on|sample collected on|sample received on|age\s*:|p\.?\s*id|accession no|billing date|report status|sex\s*:|name\s*:|mr\.|mrs\.|dr\.|client processed by|pathkind diagnostics|clinical significance|end of report)/i.test(line);
        const parseValue = (line) => {
            const cleaned = line.replace(/[,;]/g, ' ');
            const patterns = [
                /(?:^|\s)([<>]?\d+(?:\.\d+)?)(\s*[a-zA-Zμ/%/.-][a-zA-Z0-9μ/%/.-]*)?/,
                /([<>]?\d+(?:\.\d+)?\s*:\s*\d+)/,
            ];
            for (const re of patterns) {
                const m = cleaned.match(re);
                if (m) {
                    const value = (m[1] || '').trim();
                    const unit = (m[2] || '').trim().replace(/^\s+/, '');
                    if (value && !/^\d{6,}$/.test(value))
                        return { value, unit };
                }
            }
            return null;
        };
        const markers = [];
        for (const def of defs) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (skipLine(line))
                    continue;
                const lower = line.toLowerCase();
                if (!def.labels.some((l) => lower.includes(l)))
                    continue;
                const candidates = [line, lines[i + 1] || '', lines[i + 2] || ''];
                for (const candidate of candidates) {
                    if (skipLine(candidate))
                        continue;
                    const parsed = parseValue(candidate);
                    if (parsed) {
                        markers.push({
                            name: def.name,
                            value: parsed.value,
                            unit: this.normalizeUnit(parsed.unit || ''),
                        });
                        break;
                    }
                }
                break;
            }
        }
        return this.uniqueMarkers(markers);
    }
    extractDnaFindingsAsMarkers(text) {
        const markers = [];
        const patterns = [
            { name: 'APOE', regex: /APOE[^\n]*?(E\d\/E\d|e\d\/e\d)/i },
            { name: 'MTHFR', regex: /MTHFR[^\n]*?(C677T\s+Heterozygous|C677T\s+Homozygous|A1298C\s+Heterozygous|Variant detected)/i },
            { name: 'FTO', regex: /FTO[^\n]*?(AA genotype|Risk variant present|No risk variant|AT genotype|TT genotype)/i },
            { name: 'TCF7L2', regex: /TCF7L2[^\n]*?(CT genotype|TT genotype|CC genotype|Risk variant present)/i },
            { name: 'PPARG', regex: /PPARG[^\n]*?(Pro12Pro|Variant detected|Normal variant)/i },
            { name: 'VDR', regex: /VDR[^\n]*?(bb genotype|Bb genotype|BB genotype|Low absorption)/i },
            { name: 'LCT', regex: /LCT[^\n]*?(C\/T heterozygous|Partial tolerance|Lactase persistence variant absent)/i },
            { name: 'HFE', regex: /HFE[^\n]*?(H63D heterozygous|H63D homozygous|Carrier|Negative)/i },
            { name: 'CYP1A2', regex: /CYP1A2[^\n]*?(Slow metabolism variant present|Slow metabolizer|Fast metabolizer)/i },
            { name: 'COMT', regex: /COMT[^\n]*?(Variant detected|Normal|High activity|Low activity)/i },
            { name: 'BDNF', regex: /BDNF[^\n]*?(Variant detected|Normal|High activity|Low activity)/i },
            { name: 'ACE', regex: /ACE[^\n]*?(Variant detected|Normal|Insertion|Deletion)/i },
            { name: 'ACTN3', regex: /ACTN3[^\n]*?(Variant detected|Normal|RR|RX|XX)/i },
            { name: 'CLOCK', regex: /CLOCK[^\n]*?(Variant detected|Normal)/i },
            { name: 'PER3', regex: /PER3[^\n]*?(Variant detected|Normal)/i },
        ];
        for (const pattern of patterns) {
            const match = text.match(pattern.regex);
            if (match) {
                markers.push({
                    name: pattern.name,
                    value: match[1].trim(),
                    unit: '',
                });
            }
        }
        return this.uniqueMarkers(markers);
    }
    async extractTextFromFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        try {
            if (ext === '.pdf')
                return await this.extractFromPdf(filePath);
            if (['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'].includes(ext)) {
                return await this.extractFromImage(filePath);
            }
            if (['.txt', '.csv', '.json'].includes(ext)) {
                return fs.readFileSync(filePath, 'utf8');
            }
            return '';
        }
        catch (err) {
            console.error('extractTextFromFile failed:', err);
            return '';
        }
    }
    async extractFromPdf(filePath) {
        const buffer = fs.readFileSync(filePath);
        let extractedText = '';
        try {
            const pdfModule = pdfParse;
            if (typeof pdfModule === 'function') {
                const data = await pdfModule(buffer);
                extractedText = data?.text || '';
            }
            else if (typeof pdfModule?.default === 'function') {
                const data = await pdfModule.default(buffer);
                extractedText = data?.text || '';
            }
        }
        catch (err) {
            console.warn('pdf-parse failed:', err);
        }
        const cleanText = (extractedText || '')
            .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        console.log('[extractFromPdf] file:', filePath);
        console.log('[extractFromPdf] pdf-parse length:', cleanText.length);
        if (cleanText.length > 80 && !this.looksLikePdfBinary(cleanText)) {
            return cleanText;
        }
        console.log('[extractFromPdf] falling back to OCR for:', filePath);
        return await this.ocrPdfFallback(filePath);
    }
    looksLikePdfBinary(text) {
        const lower = text.toLowerCase();
        return (lower.includes('%pdf') ||
            lower.includes('endobj') ||
            lower.includes('stream') ||
            lower.includes('xref'));
    }
    async ocrPdfFallback(filePath) {
        try {
            const tempDir = path.join(process.cwd(), 'uploads', 'ocr-temp');
            fs.mkdirSync(tempDir, { recursive: true });
            const { fromPath } = require('pdf2pic');
            const converter = fromPath(filePath, {
                density: 300,
                saveFilename: `medivoy-${Date.now()}`,
                savePath: tempDir,
                format: 'png',
                width: 2000,
                height: 2800,
            });
            const pages = [];
            for (let i = 1; i <= 5; i++) {
                try {
                    const page = await converter(i, { responseType: 'image' });
                    if (page?.path) {
                        console.log('[ocrPdfFallback] generated page:', page.path);
                        pages.push(page.path);
                    }
                }
                catch (err) {
                    console.warn(`[ocrPdfFallback] stopped at page ${i}:`, err);
                    break;
                }
            }
            if (!pages.length) {
                console.warn('[ocrPdfFallback] no pages generated');
                return '';
            }
            return await this.ocrImages(pages);
        }
        catch (err) {
            console.error('OCR PDF fallback failed:', err);
            return '';
        }
    }
    async extractFromImage(filePath) {
        return await this.ocrImages([filePath]);
    }
    async ocrImages(imagePaths) {
        if (!imagePaths.length)
            return '';
        console.log('[ocrImages] imagePaths:', imagePaths);
        const worker = await (0, tesseract_js_1.createWorker)('eng');
        try {
            let combined = '';
            for (const imagePath of imagePaths) {
                try {
                    const { data } = await worker.recognize(imagePath);
                    const text = (data?.text || '').trim();
                    console.log('[ocrImages] image:', imagePath, 'text length:', text.length);
                    if (text)
                        combined += `${text}\n`;
                }
                catch (err) {
                    console.warn('OCR image failed:', imagePath, err);
                }
            }
            return combined.trim();
        }
        finally {
            await worker.terminate();
        }
    }
    normalizeUnit(unit) {
        const u = String(unit || '').trim();
        if (!u)
            return '';
        if (/^(Mrs\.?|Mr\.?|Ms\.?|Dr\.?|Age|Male|Female|Page|No\.?)$/i.test(u))
            return '';
        if (/^(gm\/dL|g\/dL)$/i.test(u))
            return 'g/dL';
        if (/^mgdL$/i.test(u))
            return 'mg/dL';
        if (/^pgmL$/i.test(u))
            return 'pg/mL';
        if (/^ngmL$/i.test(u))
            return 'ng/mL';
        if (/^mgL$/i.test(u))
            return 'mg/L';
        if (/^KmcL$/i.test(u))
            return 'K/mcL';
        if (/^MmcL$/i.test(u))
            return 'M/mcL';
        return u;
    }
    async findByUser(userId) {
        return this.repo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
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
    uniqueMarkers(markers) {
        const map = new Map();
        for (const marker of markers) {
            if (!map.has(marker.name))
                map.set(marker.name, marker);
        }
        return [...map.values()];
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