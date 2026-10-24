import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Report, MedicineSuggestion } from '../reports/entities/report.entity'

type SpecialtyRule = { specialty: string; keywords: string[] }

// Maps report findings/keywords to a doctor specialty recognised by the live
// Pharmacy API's /consultations/doctors/filter?specialty= endpoint.
const SPECIALTY_RULES: SpecialtyRule[] = [
  { specialty: 'cardiologist', keywords: ['cholesterol', 'ldl', 'hdl', 'triglyceride', 'heart', 'cardiac', 'blood pressure', 'hypertension'] },
  { specialty: 'endocrinologist', keywords: ['glucose', 'hba1c', 'diabetes', 'thyroid', 'tsh', 'insulin'] },
  { specialty: 'dermatologist', keywords: ['skin', 'acne', 'rash'] },
  { specialty: 'gynecologist', keywords: ['pregnan', 'menstru', 'ovarian', 'gynec'] },
  { specialty: 'orthopedic', keywords: ['bone', 'joint', 'fracture', 'vitamin d', 'calcium'] },
  { specialty: 'ent-specialist', keywords: ['ear', 'nose', 'throat', 'sinus'] },
  { specialty: 'pediatrician', keywords: ['child', 'infant', 'pediatric'] },
  { specialty: 'ophthalmologist', keywords: ['eye', 'vision', 'retina'] },
]

@Injectable()
export class PharmacyService {
  private pharmacyBaseUrl: string
  private customerToken: string | null = null
  private customerTokenExpiry = 0

  constructor(
    private config: ConfigService,
    @InjectRepository(Report) private reportsRepo: Repository<Report>,
  ) {
    this.pharmacyBaseUrl = this.config.get<string>('PHARMACY_API_URL') || 'http://localhost:5050/api'
  }

  // ---- low-level live API calls ----

  async searchMedicines(query: string, take = 20) {
    if (!query || query.length < 2) return { medicines: [] }

    try {
      const response = await fetch(
        `${this.pharmacyBaseUrl}/medicines?q=${encodeURIComponent(query)}&take=${take}&skip=0`,
        { headers: { 'Content-Type': 'application/json' } },
      )

      if (!response.ok) {
        console.warn('[PharmacyService] search failed:', response.status)
        return { medicines: [] }
      }

      const data = await response.json()
      const medicines = this.extractList(data, 'medicines').map((m) => this.normalizeMedicine(m))
      return { medicines }
    } catch (err) {
      console.error('[PharmacyService] search error:', err)
      return { medicines: [] }
    }
  }

  // The live catalog nests price/stock under `availability` and signals
  // prescription requirement via the drug `schedule` (OTC vs H/H1/X/etc.),
  // not a flat boolean — flatten it into the shape the UI expects.
  private normalizeMedicine(m: any) {
    const availability = m?.availability || {}
    const schedule = String(m?.schedule || '').toUpperCase()
    // Some catalog entries (esp. non-medicine SKUs) have marketing copy
    // dumped into genericName instead of an actual ingredient name.
    const genericName = m.genericName && m.genericName.length <= 60 ? m.genericName : undefined

    return {
      id: m.id,
      slug: m.slug,
      name: genericName || m.brandName,
      brandName: m.brandName,
      genericName,
      manufacturer: m.manufacturer,
      category: m.category,
      type: m.category || 'medicine',
      packText: [m.packForm, m.packSize].filter(Boolean).join(' — '),
      schedule: m.schedule,
      isPrescriptionRequired: !!schedule && schedule !== 'OTC',
      inStock: !!availability.inStock,
      sellPricePaise: availability.lowestPricePaise ?? null,
      mrpPaise: availability.highestMrpPaise ?? null,
      imageUrl: m.imageUrl,
    }
  }

  // Categories that are real catalog SKUs but aren't something you'd ever
  // suggest as a "medicine/supplement" from a report analysis (diagnostic
  // kits, devices, accessories) — excluded when picking a match for an AI
  // suggestion, though they still show up in plain catalog search.
  private isNonMedicineCategory(category?: string) {
    return /test-?kit|device|equipment|accessor|glucometer|thermometer|monitor/i.test(category || '')
  }

  async searchMolecules(query: string, take = 10) {
    if (!query || query.length < 2) return { molecules: [] }

    try {
      const response = await fetch(
        `${this.pharmacyBaseUrl}/molecules?search=${encodeURIComponent(query)}&take=${take}`,
        { headers: { 'Content-Type': 'application/json' } },
      )

      if (!response.ok) return { molecules: [] }
      const data = await response.json()
      return { molecules: this.extractList(data, 'molecules') }
    } catch (err) {
      console.error('[PharmacyService] molecules error:', err)
      return { molecules: [] }
    }
  }

  async getDoctors(specialty?: string) {
    try {
      const url = specialty
        ? `${this.pharmacyBaseUrl}/consultations/doctors/filter?specialty=${encodeURIComponent(this.toSpecialtySlug(specialty))}`
        : `${this.pharmacyBaseUrl}/consultations/doctors?q=general%20physician`

      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...(await this.authHeaders()) },
      })

      if (!response.ok) {
        console.warn('[PharmacyService] doctors failed:', response.status)
        return { doctors: [] }
      }

      const data = await response.json()
      return { doctors: this.extractList(data, 'doctors') }
    } catch (err) {
      console.error('[PharmacyService] doctors error:', err)
      return { doctors: [] }
    }
  }

  async getNearbyPharmacies(lat: number, lng: number) {
    try {
      const response = await fetch(
        `${this.pharmacyBaseUrl}/patient/pharmacies?lat=${lat}&lng=${lng}&page=1&limit=10`,
        { headers: { 'Content-Type': 'application/json' } },
      )

      if (!response.ok) return { pharmacies: [] }
      const data = await response.json()
      return { pharmacies: this.extractList(data, 'pharmacies') }
    } catch (err) {
      console.error('[PharmacyService] pharmacies error:', err)
      return { pharmacies: [] }
    }
  }

  // ---- report-driven suggestions (used by /pharmacy/suggestions) ----

  async getSuggestionsForUser(userId: string, reportId?: string) {
    const report = reportId
      ? await this.reportsRepo.findOne({ where: { id: reportId, userId } })
      : await this.reportsRepo.findOne({ where: { userId, status: 'done' }, order: { createdAt: 'DESC' } })

    if (!report) {
      return { reportId: null, reportTitle: null, medicineSuggestions: [], doctorSuggestions: [] }
    }

    const [medicineSuggestions, doctorSuggestions] = await Promise.all([
      this.enrichMedicineSuggestions(report.medicineSuggestions || []),
      this.suggestDoctors(report),
    ])

    return {
      reportId: report.id,
      reportTitle: report.title,
      medicineSuggestions,
      doctorSuggestions,
    }
  }

  // Searches the live 7-lakh-product catalog for each AI-generated suggestion
  // and attaches the best real match (preferring an in-stock, priced item)
  // so what's shown is grounded in actual purchasable products, not just AI text.
  private async enrichMedicineSuggestions(suggestions: MedicineSuggestion[]) {
    if (!suggestions?.length) return []

    return Promise.all(
      suggestions.map(async (suggestion) => {
        const { medicines } = await this.searchMedicines(suggestion.name, 5)
        const candidates = medicines.filter((m) => !this.isNonMedicineCategory(m.category))
        const live =
          candidates.find((m) => m.inStock && m.sellPricePaise != null) || candidates[0] || null

        if (!live) return { ...suggestion, live: null }

        return {
          ...suggestion,
          live: {
            id: live.id,
            slug: live.slug,
            brandName: live.brandName || live.name,
            genericName: live.genericName,
            manufacturer: live.manufacturer,
            packText: live.packText,
            sellPricePaise: live.sellPricePaise,
            mrpPaise: live.mrpPaise,
            inStock: live.inStock,
            isPrescriptionRequired: live.isPrescriptionRequired ?? suggestion.isPrescriptionRequired,
          },
        }
      }),
    )
  }

  private async suggestDoctors(report: Report) {
    const haystack = [
      ...(report.criticalFindings || []),
      ...(report.keyInsights || []),
      ...(report.findings || []).map((f: any) => f?.label || ''),
      report.reportType || '',
    ]
      .join(' ')
      .toLowerCase()

    const matchedSpecialty = SPECIALTY_RULES.find((rule) =>
      rule.keywords.some((kw) => haystack.includes(kw)),
    )?.specialty

    const { doctors } = await this.getDoctors(matchedSpecialty || 'general-physician')
    return doctors.slice(0, 5)
  }

  // ---- auth for endpoints that require a Pharmacy API customer token ----

  private async authHeaders(): Promise<Record<string, string>> {
    const token = await this.getCustomerToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async getCustomerToken(): Promise<string | null> {
    const email = this.config.get<string>('PHARMACY_API_EMAIL')
    const password = this.config.get<string>('PHARMACY_API_PASSWORD')
    if (!email || !password) return null

    if (this.customerToken && Date.now() < this.customerTokenExpiry) {
      return this.customerToken
    }

    try {
      const response = await fetch(`${this.pharmacyBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        console.warn('[PharmacyService] customer login failed:', response.status)
        return null
      }

      const data = await response.json()
      const token = data?.accessToken || data?.token || data?.customerToken || null
      if (!token) return null

      this.customerToken = token
      this.customerTokenExpiry = Date.now() + 25 * 60 * 1000
      return token
    } catch (err) {
      console.error('[PharmacyService] customer login error:', err)
      return null
    }
  }

  private toSpecialtySlug(specialty: string) {
    return specialty.trim().toLowerCase().replace(/\s+/g, '-')
  }

  // The live API wraps every response as { success, statusCode, data: {...} }
  // with the actual list nested one level deeper (e.g. data.data.medicines).
  private extractList(data: any, key: string): any[] {
    if (Array.isArray(data)) return data

    for (const container of [data, data?.data]) {
      if (Array.isArray(container?.[key])) return container[key]
      if (Array.isArray(container?.items)) return container.items
    }

    return []
  }
}
