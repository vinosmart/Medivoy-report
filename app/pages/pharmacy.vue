<template>
  <div class="pharmacy-page">
    <!-- Disclaimer Banner -->
    <div class="disclaimer-banner">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div>
        <strong>Medical Disclaimer:</strong> The medicine and supplement information shown on this page is for informational purposes only. Always consult a qualified doctor or pharmacist before purchasing or taking any medication. Do not self-diagnose or self-medicate.
      </div>
    </div>

    <!-- Pharmacy Header -->
    <div class="pharmacy-header">
      <h1 class="page-title">Pharmacy</h1>
      <p class="page-subtitle">Search medicines, find doctors, and order from nearby pharmacies</p>
    </div>

    <!-- Suggested for You (from latest AI report analysis, live pharmacy data) -->
    <section v-if="suggestions?.medicineSuggestions?.length || suggestions?.doctorSuggestions?.length" class="card suggestions-card">
      <h2 class="card-title">Suggested for You</h2>
      <p class="card-desc">Based on your latest report analysis "{{ suggestions.reportTitle }}", cross-checked against live pharmacy stock.</p>

      <div v-if="suggestions.medicineSuggestions?.length" class="med-suggestions-list">
        <div v-for="(med, idx) in suggestions.medicineSuggestions" :key="idx" class="med-suggestion-item" :class="'med-type-' + med.type">
          <div class="med-suggestion-header">
            <span class="med-suggestion-type">{{ med.type === 'medicine' ? '💊' : med.type === 'vitamin' ? '💊' : '🌿' }} {{ med.type }}</span>
            <span v-if="med.live?.isPrescriptionRequired ?? med.isPrescriptionRequired" class="rx-badge">Rx</span>
          </div>
          <h3 class="med-name">{{ med.live?.brandName || med.name }}</h3>
          <p v-if="med.live?.genericName" class="med-generic">{{ med.live.genericName }}</p>
          <p class="med-suggestion-reason">{{ med.reason }}</p>
          <p v-if="med.evidence" class="med-suggestion-evidence">Evidence: {{ med.evidence }}</p>
          <div v-if="med.live?.sellPricePaise != null" class="med-price">
            <span class="price">₹{{ (med.live.sellPricePaise / 100).toFixed(2) }}</span>
            <span v-if="med.live.mrpPaise" class="mrp">MRP ₹{{ (med.live.mrpPaise / 100).toFixed(2) }}</span>
          </div>
          <a
            v-if="med.live?.slug"
            :href="`https://pharmacy.medivoy.ae/product/${med.live.slug}`"
            target="_blank"
            rel="noopener noreferrer"
            class="buy-btn"
          >
            Buy Now →
          </a>
        </div>
      </div>

      <div v-if="suggestions.doctorSuggestions?.length" class="doctor-list suggested-doctors">
        <div v-for="doc in suggestions.doctorSuggestions" :key="doc.doctorId || doc.id" class="doctor-card">
          <div class="doc-avatar">{{ (doc.name || 'Dr. ')[0] }}</div>
          <div class="doc-info">
            <p class="doc-name">{{ doc.name || 'Doctor' }}</p>
            <p class="doc-spec">{{ doc.specialty || doc.specialties?.join(', ') || 'General Physician' }}</p>
            <p v-if="doc.experience" class="doc-exp">{{ doc.experience }} years experience</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Search -->
    <div class="search-section">
      <div class="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for medicines, vitamins, or supplements..."
          @input="onSearch"
        />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''; results = [];">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="searching" class="loading-section">
      <div class="loading-spinner"></div>
      <p>Searching medicines...</p>
    </div>

    <!-- Results -->
    <div v-else-if="results.length" class="results-grid">
      <div v-for="med in results" :key="med.id" class="medicine-card">
        <div class="med-header">
          <span class="med-type" :class="med.type?.toLowerCase()">{{ med.type || 'Medicine' }}</span>
          <span v-if="med.isPrescriptionRequired" class="rx-badge">Rx</span>
        </div>
        <h3 class="med-name">{{ med.brandName || med.name }}</h3>
        <p v-if="med.genericName" class="med-generic">{{ med.genericName }}</p>
        <p v-if="med.manufacturer" class="med-manufacturer">{{ med.manufacturer }}</p>
        <div v-if="med.packText" class="med-pack">{{ med.packText }}</div>
        <div v-if="med.sellPricePaise != null" class="med-price">
          <span class="price">₹{{ (med.sellPricePaise / 100).toFixed(2) }}</span>
          <span v-if="med.mrpPaise" class="mrp">MRP ₹{{ (med.mrpPaise / 100).toFixed(2) }}</span>
        </div>
        <a
          v-if="med.slug"
          :href="`https://pharmacy.medivoy.ae/product/${med.slug}`"
          target="_blank"
          rel="noopener noreferrer"
          class="buy-btn"
        >
          Buy Now →
        </a>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="searchQuery && !searching" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
      <h3>No medicines found</h3>
      <p>Try a different search term or check the spelling.</p>
    </div>

    <!-- Default browse -->
    <div v-else class="default-sections">
      <section class="card">
        <h2 class="card-title">Browse Categories</h2>
        <div class="category-grid">
          <div v-for="cat in categories" :key="cat.name" class="category-chip" @click="searchQuery = cat.name; onSearch()">
            <span class="cat-icon">{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </div>
        </div>
      </section>

      <section class="card">
        <h2 class="card-title">Find a Doctor</h2>
        <p class="card-desc">Search for doctors by specialty to book a consultation.</p>
        <div class="doctor-specialties">
          <button v-for="spec in specialties" :key="spec" class="specialty-btn" @click="searchDoctors(spec)">
            {{ spec }}
          </button>
        </div>
        <div v-if="doctors.length" class="doctor-list">
          <div v-for="doc in doctors" :key="doc.doctorId || doc.id" class="doctor-card">
            <div class="doc-avatar">{{ (doc.name || 'Dr. ')[0] }}</div>
            <div class="doc-info">
              <p class="doc-name">{{ doc.name || 'Doctor' }}</p>
              <p class="doc-spec">{{ doc.specialty || doc.specialties?.join(', ') || 'General Physician' }}</p>
              <p v-if="doc.experience" class="doc-exp">{{ doc.experience }} years experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi()
const searchQuery = ref('')
const results = ref<any[]>([])
const searching = ref(false)
const doctors = ref<any[]>([])
const suggestions = ref<any>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  try {
    suggestions.value = await api.getPharmacySuggestions()
  } catch {
    suggestions.value = null
  }
})

const categories = [
  { name: 'Paracetamol', icon: '💊' },
  { name: 'Vitamins', icon: '💊' },
  { name: 'Antibiotics', icon: '💊' },
  { name: 'Blood Pressure', icon: '❤️' },
  { name: 'Diabetes', icon: '🩸' },
  { name: 'Supplements', icon: '💊' },
]

const specialties = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'ENT Specialist',
  'Gynecologist',
  'Pediatrician',
  'Orthopedic',
  'Ophthalmologist',
]

async function onSearch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!searchQuery.value || searchQuery.value.length < 2) {
    results.value = []
    return
  }

  searching.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const data = await api.searchMedicines(searchQuery.value)
      results.value = data.medicines || []
    } catch {
      results.value = []
    } finally {
      searching.value = false
    }
  }, 400)
}

async function searchDoctors(specialty: string) {
  try {
    const data = await api.getDoctors(specialty)
    doctors.value = data.data || data.doctors || []
  } catch {
    doctors.value = []
  }
}
</script>

<style scoped>
.pharmacy-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.disclaimer-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.8125rem;
  color: #92400e;
  line-height: 1.5;
}
.disclaimer-banner svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem;
}
.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.search-section {
  margin: 1.25rem 0;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: border-color 0.15s;
}
.search-bar:focus-within {
  border-color: #01696f;
  box-shadow: 0 0 0 3px rgba(1, 105, 111, 0.1);
}
.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9375rem;
  color: #111827;
  background: transparent;
}
.search-bar input::placeholder {
  color: #9ca3af;
}
.clear-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.clear-btn:hover {
  color: #374151;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 0;
  color: #6b7280;
}
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #01696f;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.medicine-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.875rem;
  padding: 1.25rem;
  transition: box-shadow 0.15s;
}
.medicine-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.med-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.med-type {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
}
.rx-badge {
  font-size: 0.625rem;
  font-weight: 800;
  color: #dc2626;
  background: #fee2e2;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}
.med-name {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
}
.med-generic {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 0.25rem;
}
.med-manufacturer {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0 0 0.5rem;
}
.med-pack {
  font-size: 0.8125rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}
.med-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.price {
  font-size: 1.125rem;
  font-weight: 800;
  color: #01696f;
}
.mrp {
  font-size: 0.75rem;
  color: #9ca3af;
  text-decoration: line-through;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}
.empty-state svg { margin-bottom: 1rem; }
.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}
.empty-state p { font-size: 0.9375rem; }

.default-sections {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
}
.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.75rem;
}
.card-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
}
.category-chip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.15s;
}
.category-chip:hover {
  border-color: #01696f;
  color: #01696f;
  background: #f0fdfa;
}
.cat-icon { font-size: 1rem; }

.suggestions-card {
  border-color: #dbeafe;
  background: #f8faff;
}
.med-suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
}
.med-suggestion-item {
  padding: 1rem;
  border-radius: 0.875rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}
.med-suggestion-item.med-type-medicine { border-left: 3px solid #f59e0b; }
.med-suggestion-item.med-type-supplement { border-left: 3px solid #10b981; }
.med-suggestion-item.med-type-vitamin { border-left: 3px solid #3b82f6; }
.med-suggestion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}
.med-suggestion-type {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}
.med-suggestion-reason {
  font-size: 0.8125rem;
  color: #4b5563;
  line-height: 1.55;
  margin: 0.375rem 0 0.5rem;
}
.med-suggestion-evidence {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
  margin: -0.25rem 0 0.5rem;
}
.buy-btn {
  display: inline-flex;
  align-items: center;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  background: #01696f;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background 0.15s;
}
.buy-btn:hover {
  background: #014f54;
}
.suggested-doctors {
  padding-top: 0.5rem;
}

.doctor-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.specialty-btn {
  padding: 0.5rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}
.specialty-btn:hover {
  border-color: #01696f;
  color: #01696f;
  background: #f0fdfa;
}

.doctor-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.doctor-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #f9fafb;
}
.doc-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #01696f, #0c4e54);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.125rem;
  flex-shrink: 0;
}
.doc-info { flex: 1; }
.doc-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.125rem;
}
.doc-spec {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 0.125rem;
}
.doc-exp {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}
</style>
