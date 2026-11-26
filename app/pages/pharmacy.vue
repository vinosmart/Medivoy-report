<template>
  <div class="pharmacy-page">
    <!-- Disclaimer Banner -->
    <div class="disclaimer-banner">
      <IconAlertCircle :size="20" :stroke-width="1.8" aria-hidden="true" />
      <div>
        <strong>Medical Disclaimer:</strong> The medicine and supplement information shown on this page is for informational purposes only. Always consult a qualified doctor or pharmacist before purchasing or taking any medication. Do not self-diagnose or self-medicate.
      </div>
    </div>

    <PageHeading
      :icon="IconPill"
      title="Pharmacy"
      description="Search medicines and find doctors. Always check medication choices with a qualified professional."
      eyebrow="Care and medication"
    />

    <!-- Suggested for You (from latest AI report analysis, live pharmacy data) -->
    <section v-if="suggestions?.medicineSuggestions?.length || suggestions?.doctorSuggestions?.length" class="card suggestions-card">
      <h2 class="card-title">Suggested for You</h2>
      <p class="card-desc">Based on your latest report analysis "{{ suggestions.reportTitle }}", cross-checked against live pharmacy stock.</p>

      <div v-if="suggestions.medicineSuggestions?.length" class="med-suggestions-list">
        <div v-for="(med, idx) in suggestions.medicineSuggestions" :key="idx" class="med-suggestion-item" :class="'med-type-' + med.type">
          <div class="med-suggestion-header">
            <span class="med-suggestion-type">
              <component :is="medicineIcon(med.type)" :size="15" aria-hidden="true" />
              {{ med.type }}
            </span>
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
        <IconSearch :size="18" :stroke-width="1.8" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="text"
          aria-label="Search medicines, vitamins, or supplements"
          :placeholder="animatedSearchPlaceholder"
          @input="onSearch"
        />
        <button v-if="searchQuery" type="button" class="clear-btn" aria-label="Clear search" @click="clearSearch">
          <IconX :size="16" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="searching" class="loading-section">
      <div class="loading-spinner"></div>
      <p>Searching medicines...</p>
    </div>

    <div v-else-if="searchError" class="empty-state" role="alert">
      <IconAlertCircle :size="42" :stroke-width="1.4" aria-hidden="true" />
      <h3>Search unavailable</h3>
      <p>{{ searchError }}</p>
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
      <IconSearch :size="42" :stroke-width="1.4" aria-hidden="true" />
      <h3>No medicines found</h3>
      <p>Try a different search term or check the spelling.</p>
    </div>

    <!-- Default browse -->
    <div v-else class="default-sections">
      <section class="card">
        <h2 class="card-title">Browse Categories</h2>
        <div class="category-grid">
          <button v-for="cat in categories" :key="cat.name" type="button" class="category-chip" @click="searchQuery = cat.name; onSearch()">
            <component :is="cat.icon" class="cat-icon" :size="17" :stroke-width="1.8" aria-hidden="true" />
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </section>

      <section class="card">
        <h2 class="card-title">Find a Doctor</h2>
        <p class="card-desc">Search for doctors by specialty to book a consultation.</p>
        <div class="doctor-specialties">
          <button v-for="spec in specialties" :key="spec" type="button" class="specialty-btn" :disabled="searchingDoctors" @click="searchDoctors(spec)">
            {{ spec }}
          </button>
        </div>
        <p v-if="doctorsError" role="alert" class="mb-3 text-sm text-rose-700">
          {{ doctorsError }}
        </p>
        <p v-if="searchingDoctors" role="status" class="mb-3 text-sm text-slate-500">
          Searching doctors...
        </p>
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
import IconActivityHeartbeat from "@tabler/icons-vue/icons/IconActivityHeartbeat";
import IconAlertCircle from "@tabler/icons-vue/icons/IconAlertCircle";
import IconHeartRateMonitor from "@tabler/icons-vue/icons/IconHeartRateMonitor";
import IconLeaf from "@tabler/icons-vue/icons/IconLeaf";
import IconPill from "@tabler/icons-vue/icons/IconPill";
import IconSearch from "@tabler/icons-vue/icons/IconSearch";
import IconSun from "@tabler/icons-vue/icons/IconSun";
import IconX from "@tabler/icons-vue/icons/IconX";
import type { Component } from "vue";
import { getApiErrorMessage } from "~/utils/apiError";

const api = useMedivoyApi()
const searchQuery = ref('')
const animatedSearchPlaceholder = useAnimatedPlaceholder([
  "Search medicines",
  "Search vitamins",
  "Search supplements",
])
const results = ref<any[]>([])
const searching = ref(false)
const doctors = ref<any[]>([])
const searchingDoctors = ref(false)
const doctorsError = ref("")
const searchError = ref("")
const suggestions = ref<any>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let searchRequestId = 0

onMounted(async () => {
  try {
    suggestions.value = await api.getPharmacySuggestions()
  } catch {
    suggestions.value = null
  }
})

const categories = [
  { name: 'Paracetamol', icon: IconPill },
  { name: 'Vitamins', icon: IconSun },
  { name: 'Antibiotics', icon: IconPill },
  { name: 'Blood Pressure', icon: IconHeartRateMonitor },
  { name: 'Diabetes', icon: IconActivityHeartbeat },
  { name: 'Supplements', icon: IconLeaf },
]

const medicineIcon = (type?: string): Component =>
  type?.toLowerCase() === 'supplement' ? IconLeaf : IconPill

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
  debounceTimer = null
  const query = searchQuery.value.trim()
  const requestId = ++searchRequestId
  searchError.value = ""

  if (query.length < 2) {
    results.value = []
    searching.value = false
    return
  }

  searching.value = true
  debounceTimer = setTimeout(async () => {
    debounceTimer = null
    try {
      const data = await api.searchMedicines(query)
      if (requestId === searchRequestId) {
        results.value = data.medicines || []
      }
    } catch (error) {
      if (requestId === searchRequestId) {
        results.value = []
        searchError.value = getApiErrorMessage(
          error,
          "We couldn't search medicines. Please try again.",
        )
      }
    } finally {
      if (requestId === searchRequestId) searching.value = false
    }
  }, 400)
}

function clearSearch() {
  searchRequestId += 1
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = null
  searchQuery.value = ""
  results.value = []
  searchError.value = ""
  searching.value = false
}

async function searchDoctors(specialty: string) {
  searchingDoctors.value = true
  doctorsError.value = ""
  try {
    const data = await api.getDoctors(specialty)
    doctors.value = data.data || data.doctors || []
  } catch (error) {
    doctors.value = []
    doctorsError.value = getApiErrorMessage(
      error,
      "We couldn't search doctors. Please try again.",
    )
  } finally {
    searchingDoctors.value = false
  }
}

onBeforeUnmount(() => {
  searchRequestId += 1
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
.pharmacy-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: none;
  margin: 0;
  padding: 0 0 2rem;
}

.disclaimer-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #eff8fb;
  border: 1px solid #c8e6ed;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 0.8125rem;
  color: #24566a;
  line-height: 1.5;
}
.disclaimer-banner svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: #0e7490;
}

.search-section {
  margin: 0;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #d8e2eb;
  border-radius: 1rem;
  padding: 0.875rem 1rem;
  box-shadow: 0 10px 24px rgb(15 42 67 / 0.035);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;
}
.search-bar > svg {
  flex-shrink: 0;
  color: #71869a;
}
.search-bar:focus-within {
  border-color: #0e7490;
  box-shadow: 0 0 0 3px rgb(14 116 144 / 0.12);
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
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border-radius: 0.625rem;
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
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 1rem;
}
.medicine-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.25rem;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}
.medicine-card:hover {
  transform: translateY(-2px);
  border-color: #c6dce4;
  box-shadow: 0 14px 28px rgb(15 42 67 / 0.08);
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
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #38536a;
  background: #fff;
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    background-color 180ms ease;
}
.category-chip:hover {
  transform: translateY(-1px);
  border-color: #b7dbe3;
  color: #0e6178;
  background: #f0f9fb;
}
.cat-icon { flex-shrink: 0; color: #0e7490; }

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
  background: linear-gradient(135deg, #0e7490, #155e75);
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

@media (max-width: 640px) {
  .category-chip,
  .specialty-btn {
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-bar,
  .medicine-card,
  .category-chip,
  .specialty-btn {
    transition: none;
  }

  .medicine-card:hover,
  .category-chip:hover {
    transform: none;
  }

  .loading-spinner {
    animation: none;
  }
}
</style>
