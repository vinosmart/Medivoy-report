<template>
  <div class="pharmacy-page">
    <!-- Disclaimer Banner -->
    <div class="disclaimer-banner" role="note">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div>
        <strong>Medical Disclaimer:</strong> For information only. Consult a doctor or pharmacist before taking medication. Do not self-medicate.
      </div>
    </div>

    <!-- Pharmacy Header -->
    <div class="pharmacy-header">
      <span class="pharmacy-eyebrow">MEDICINES &amp; CARE</span>
      <h1 class="page-title">Pharmacy</h1>
      <p class="page-subtitle">Search medicines, find doctors, and order from nearby pharmacies</p>
      <div class="search-section">
        <div class="search-heading">
          <div>
            <h2>Find a medicine</h2>
            <p>Search by medicine, vitamin, or supplement name.</p>
          </div>
        </div>
        <div class="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            aria-label="Search medicines, vitamins, or supplements"
            :placeholder="searchPlaceholder"
            @input="onSearch"
          />
          <button v-if="searchQuery" type="button" class="clear-btn" aria-label="Clear search" @click="searchQuery = ''; results = [];">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
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
          <button v-for="cat in categories" :key="cat.name" type="button" class="category-chip" @click="searchQuery = cat.name; onSearch()">
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </section>

      <section class="card">
        <h2 class="card-title">Find a Doctor</h2>
        <p class="card-desc">Search for doctors by specialty to book a consultation.</p>
        <div class="doctor-specialties">
          <button v-for="spec in specialties" :key="spec" type="button" class="specialty-btn" @click="searchDoctors(spec)">
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
const searchPlaceholder = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let searchTypeTimer: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  startSearchPlaceholderTypewriter()
  try {
    suggestions.value = await api.getPharmacySuggestions()
  } catch {
    suggestions.value = null
  }
})

onBeforeUnmount(() => {
  if (searchTypeTimer) clearTimeout(searchTypeTimer)
  if (debounceTimer) clearTimeout(debounceTimer)
})

function startSearchPlaceholderTypewriter() {
  const phrase = 'Search for medicines, vitamins, or supplements...'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    searchPlaceholder.value = phrase
    return
  }

  let characterIndex = 0
  const tick = () => {
    characterIndex++
    searchPlaceholder.value = phrase.slice(0, characterIndex)
    if (characterIndex < phrase.length) {
      searchTypeTimer = setTimeout(tick, 45)
    }
  }
  tick()
}

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
  max-width: 1380px;
  margin: 0 auto;
  padding: 1.75rem 1rem 3rem;
  color: #233b59;
  font-family: Poppins, system-ui, sans-serif;
}

.pharmacy-header {
  margin-bottom: 1.5rem;
  padding: 0;
}

.disclaimer-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  background: #f7faff;
  border: 1px solid #dce9f7;
  border-left: 3px solid #0b1c39;
  border-radius: 10px;
  padding: 1rem 1.125rem;
  margin-bottom: 1.5rem;
  font-size: 0.8125rem;
  color: #5a6f89;
  line-height: 1.6;
}
.disclaimer-banner svg {
  flex-shrink: 0;
  margin-top: 3px;
  color: #0b1c39;
}
.disclaimer-banner strong {
  color: #1d3554;
  font-weight: 700;
}

.pharmacy-eyebrow {
  display: block;
  margin-bottom: 0.45rem;
  color: #0b1c39;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.page-title {
  font-size: 2rem;
  font-weight: 750;
  letter-spacing: -0.045em;
  color: #0b1c39;
  margin: 0 0 0.25rem;
}
.page-subtitle {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #71859f;
  margin: 0;
}

.search-section {
  margin: 1.5rem 0 0;
}
.search-heading {
  margin-bottom: 0.75rem;
}
.search-heading h2 {
  margin: 0;
  color: #1d3554;
  font-size: 1.125rem;
  font-weight: 750;
}
.search-heading p {
  margin: 0.25rem 0 0;
  color: #7d91aa;
  font-size: 0.8125rem;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: #fff;
  border: 1px solid #d6e2f0;
  min-height: 56px;
  border-radius: 11px;
  padding: 0.95rem 1.1rem;
  box-shadow: 0 4px 14px rgba(35, 67, 104, 0.035);
  transition: border-color 0.18s, box-shadow 0.18s;
}
.search-bar:focus-within {
  border-color: #0b1c39;
  box-shadow: 0 0 0 3px rgba(11, 28, 57, 0.08);
}
.search-bar > svg {
  stroke: #0b1c39;
}
.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9375rem;
  color: #304a69;
  font-family: inherit;
  background: transparent;
}
.search-bar input::placeholder {
  color: #98a9bd;
}
.clear-btn {
  background: none;
  border: none;
  color: #8094ad;
  cursor: pointer;
  padding: 6px;
  border-radius: 7px;
  transition: color 0.18s ease, background-color 0.18s ease, transform 0.18s ease;
}
.clear-btn:hover {
  transform: scale(1.05);
  color: #3478cc;
  background: #f2f7fd;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 0;
  color: #7187a1;
  font-size: 0.875rem;
}
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5edf6;
  border-top-color: #3478cc;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.125rem;
}
.medicine-card {
  background: #fff;
  border: 1px solid #e4ecf5;
  border-radius: 1rem;
  padding: 1.375rem;
  box-shadow: 0 6px 20px rgba(33, 70, 112, 0.035);
  transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
}
.medicine-card:hover {
  transform: translateY(-2px);
  border-color: #d3e3f5;
  box-shadow: 0 10px 24px rgba(42, 82, 132, 0.075);
}
.med-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.med-type {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
}
.rx-badge {
  font-size: 0.6875rem;
  font-weight: 800;
  color: #dc2626;
  background: #fee2e2;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}
.med-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
}
.med-generic {
  font-size: 0.875rem;
  color: #7187a1;
  margin: 0 0 0.25rem;
}
.med-manufacturer {
  font-size: 0.8125rem;
  color: #8397b0;
  margin: 0 0 0.5rem;
}
.med-pack {
  font-size: 0.875rem;
  color: #637a95;
  margin-bottom: 0.5rem;
}
.med-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0b1c39;
}
.mrp {
  font-size: 0.8125rem;
  color: #8a9db5;
  text-decoration: line-through;
}

.empty-state {
  border: 1px dashed #dbe6f2;
  border-radius: 1rem;
  background: linear-gradient(145deg, #fff, #f8fbff);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  color: #7187a1;
}
.empty-state svg { margin-bottom: 1rem; }
.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2b4564;
  margin-bottom: 0.5rem;
}
.empty-state p { font-size: 1rem; }

.default-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.card {
  background: #fff;
  border: 1px solid #e2eaf4;
  border-radius: 16px;
  padding: 1.35rem 1.5rem;
  box-shadow: 0 5px 16px rgba(33, 70, 112, 0.035);
}
.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #203b5b;
  margin: 0 0 0.875rem;
}
.card-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: #7489a3;
  margin: 0 0 1rem;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}
.category-chip {
  display: flex;
  min-width: 0;
  min-height: 38px;
  align-items: center;
  padding: 0.48rem 0.9rem;
  border: 1px solid #dde7f3;
  border-radius: 9px;
  font-size: 0.8125rem;
  font-weight: 650;
  font-family: inherit;
  color: #49617d;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}
.category-chip:hover {
  transform: translateY(-1px);
  border-color: #0b1c39;
  color: #0b1c39;
  background: #f7faff;
  box-shadow: 0 5px 12px rgba(11, 28, 57, 0.08);
}
.category-chip:active,
.specialty-btn:active {
  transform: scale(0.98);
}
.category-chip:focus-visible,
.specialty-btn:focus-visible,
.clear-btn:focus-visible,
.buy-btn:focus-visible {
  outline: 3px solid rgba(71, 139, 211, 0.25);
  outline-offset: 2px;
}
.suggestions-card {
  border-color: #dfe9f6;
  background: linear-gradient(145deg, #fff, #f9fbff);
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
  border: 1px solid #e4ecf5;
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
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #7389a4;
}
.med-suggestion-reason {
  font-size: 0.875rem;
  color: #637a95;
  line-height: 1.55;
  margin: 0.375rem 0 0.5rem;
}
.med-suggestion-evidence {
  font-size: 0.8125rem;
  color: #7187a1;
  font-style: italic;
  margin: -0.25rem 0 0.5rem;
}
.buy-btn {
  display: inline-flex;
  align-items: center;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  background: #3478cc;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}
.buy-btn:hover {
  transform: translateY(-1px);
  background: #2867b4;
  box-shadow: 0 5px 12px rgba(52, 120, 204, 0.16);
}
.suggested-doctors {
  padding-top: 0.5rem;
}

.doctor-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 1rem;
}
.specialty-btn {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  padding: 0.48rem 0.85rem;
  border: 1px solid #e3ebf5;
  border-radius: 9px;
  font-size: 0.8125rem;
  font-weight: 650;
  font-family: inherit;
  color: #49617d;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}
.specialty-btn:hover {
  transform: translateY(-1px);
  border-color: #0b1c39;
  color: #0b1c39;
  background: #f7faff;
  box-shadow: 0 5px 12px rgba(11, 28, 57, 0.08);
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
  border: 1px solid #e4ecf5;
  border-radius: 0.875rem;
  background: #fbfcfe;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}
.doctor-card:hover {
  border-color: #d3e3f5;
  background: #fff;
  box-shadow: 0 5px 14px rgba(42, 82, 132, 0.06);
}
.doc-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4b91e2, #245fa5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  flex-shrink: 0;
}
.doc-info { flex: 1; }
.doc-name {
  font-size: 1rem;
  font-weight: 700;
  color: #2b4564;
  margin: 0 0 0.125rem;
}
.doc-spec {
  font-size: 0.875rem;
  color: #7187a1;
  margin: 0 0 0.125rem;
}
.doc-exp {
  font-size: 0.8125rem;
  color: #8397b0;
  margin: 0;
}

@keyframes pharmacy-enter {
  from {
    opacity: 0;
    translate: 0 9px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
.disclaimer-banner,
.pharmacy-header,
.suggestions-card,
.loading-section,
.results-grid,
.empty-state,
.default-sections > .card {
  animation: pharmacy-enter 460ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.pharmacy-header {
  animation-delay: 60ms;
}
.suggestions-card,
.results-grid,
.empty-state,
.default-sections > .card:first-child {
  animation-delay: 130ms;
}
.default-sections > .card:nth-child(2) {
  animation-delay: 210ms;
}
.medicine-card,
.med-suggestion-item,
.doctor-card {
  animation: pharmacy-enter 380ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.medicine-card:nth-child(1),
.med-suggestion-item:nth-child(1),
.doctor-card:nth-child(1) {
  animation-delay: 180ms;
}
.medicine-card:nth-child(2),
.med-suggestion-item:nth-child(2),
.doctor-card:nth-child(2) {
  animation-delay: 230ms;
}
.medicine-card:nth-child(3),
.med-suggestion-item:nth-child(3),
.doctor-card:nth-child(3) {
  animation-delay: 280ms;
}

@media (max-width: 960px) {
  .category-grid { gap: 0.5rem; }
}

@media (max-width: 560px) {
  .pharmacy-page {
    padding: 1rem 0.75rem 2rem;
  }
  .pharmacy-header { margin-bottom: 1.25rem; }
  .page-title {
    font-size: 1.75rem;
  }
  .default-sections .card { padding: 1rem 0; }
}

@media (prefers-reduced-motion: reduce) {
  .disclaimer-banner,
  .pharmacy-header,
  .suggestions-card,
  .loading-section,
  .results-grid,
  .empty-state,
  .default-sections > .card,
  .medicine-card,
  .med-suggestion-item,
  .doctor-card {
    animation: none;
    translate: none;
  }
  .clear-btn,
  .category-chip,
  .specialty-btn,
  .buy-btn,
  .medicine-card,
  .doctor-card {
    transition: none;
  }
  .clear-btn:hover,
  .category-chip:hover,
  .category-chip:active,
  .specialty-btn:hover,
  .specialty-btn:active,
  .buy-btn:hover,
  .medicine-card:hover {
    transform: none;
  }
  .loading-spinner {
    animation: none;
  }
}
</style>
