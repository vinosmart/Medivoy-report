<template>
  <div class="space-y-6">
    <section
      class="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-700 p-6 text-white shadow-xl sm:p-8"
    >
      <div class="max-w-3xl">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 ring-1 ring-inset ring-white/10"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          Genetic risk profiling
        </span>
        <h3 class="mt-4 text-3xl font-bold sm:text-4xl">
          Personalised health risk profile from DNA markers.
        </h3>
        <p class="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
          Upload a DNA report PDF or enter variants manually to get an
          easy-to-read genetic risk summary and recommendations.
        </p>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-12">
      <div class="space-y-6 xl:col-span-5">
        <div
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-white">
                Upload DNA report
              </p>
              <p class="mt-1 text-sm text-slate-500">
                Upload a DNA report PDF or TXT. We extract APOE, MTHFR, FTO,
                LCT, HFE, and other key variants automatically.
              </p>
            </div>
            <div
              class="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-2xl"
            >
              🧬
            </div>
          </div>
          <NuxtLink
            to="/reports/upload"
            class="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white! shadow-lg shadow-slate-950/10 hover:bg-slate-800"
            >Upload DNA report</NuxtLink
          >
        </div>

        <div
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div>
            <p class="text-base font-semibold text-slate-950">
              Or enter variants manually
            </p>
            <p class="mt-1 text-sm text-slate-500">
              Use the dropdowns below to build a quick genetic profile.
            </p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="gene in genes" :key="gene.name" class="space-y-1">
              <label
                class="text-xs font-medium uppercase tracking-wide text-slate-500"
                >{{ gene.name }}</label
              >
              <select
                v-model="variants[gene.name]"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              >
                <option value="">Unknown</option>
                <option v-for="opt in gene.options" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </div>
          </div>
          <button
            @click="analyze"
            :disabled="saving"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              v-if="saving"
              class="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            {{ saving ? "Saving..." : "Analyze variants" }}
          </button>
        </div>
      </div>

      <div class="space-y-6 xl:col-span-7">
        <div v-if="loading" class="space-y-3 animate-pulse">
          <div class="h-24 rounded-3xl bg-slate-100"></div>
        </div>

        <div v-else-if="result" class="space-y-6">
          <section class="grid gap-4 sm:grid-cols-3">
            <div
              class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p
                class="text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Genetic risk score
              </p>
              <p
                class="mt-3 text-4xl font-black"
                :class="
                  result.riskScore >= 60
                    ? 'text-rose-600'
                    : result.riskScore >= 30
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                "
              >
                {{ result.riskScore }}
              </p>
              <p class="mt-2 text-xs text-slate-400">
                Calculated from selected markers
              </p>
            </div>
            <div
              class="sm:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p
                class="text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Summary
              </p>
              <p class="mt-3 text-sm leading-7 text-slate-700">
                {{ result.summary }}
              </p>
            </div>
          </section>

          <section
            class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-base font-semibold text-slate-950">
                  Variant findings
                </p>
                <p class="mt-1 text-sm text-slate-500">
                  Each marker is categorized by risk level.
                </p>
              </div>
            </div>
            <div class="mt-4 space-y-3">
              <article
                v-for="(f, i) in result.findings"
                :key="i"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div
                  class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p class="text-sm font-semibold text-slate-900">
                    {{ f.label }}
                  </p>
                  <span
                    class="w-fit rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="
                      f.status === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : f.status === 'low'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                    "
                  >
                    {{
                      f.status === "high"
                        ? "Elevated risk"
                        : f.status === "low"
                          ? "Moderate"
                          : "Normal"
                    }}
                  </span>
                </div>
                <p class="mt-1 text-xs text-slate-500">{{ f.value }}</p>
                <p v-if="f.note" class="mt-2 text-xs leading-6 text-slate-600">
                  {{ f.note }}
                </p>
              </article>
            </div>
          </section>

          <section
            class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p class="text-base font-semibold text-slate-950">
              Personalised recommendations
            </p>
            <ul class="mt-4 space-y-2">
              <li
                v-for="(r, i) in result.recommendations"
                :key="i"
                class="flex gap-3 text-sm text-slate-700"
              >
                <span
                  class="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500"
                ></span>
                <span>{{ r }}</span>
              </li>
            </ul>
          </section>
        </div>

        <div
          v-else
          class="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm"
        >
          Select variants and click
          <span class="font-semibold text-slate-900">Analyze variants</span> to
          generate a genetic health profile.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const api = useMedivoyApi();
const genes = [
  { name: "APOE", options: ["E2/E2", "E2/E3", "E3/E3", "E3/E4", "E4/E4"] },
  {
    name: "MTHFR",
    options: [
      "Normal",
      "C677T heterozygous",
      "C677T homozygous",
      "A1298C heterozygous",
    ],
  },
  { name: "FTO", options: ["No risk variant", "Risk variant present"] },
  {
    name: "LCT",
    options: ["Lactase persistence", "Lactase persistence variant absent"],
  },
  { name: "HFE", options: ["Negative", "Heterozygous carrier", "Positive"] },
  {
    name: "CYP1A2",
    options: ["Fast metaboliser", "Slow metabolism variant present"],
  },
];
const variants = reactive<Record<string, string>>({});
const result = ref<any | null>(null);
const loading = ref(true);
const saving = ref(false);
const variantNotes: Record<string, string> = {
  APOE: "APOE E4 is associated with higher LDL and cardiovascular risk.",
  MTHFR: "MTHFR variants may affect folate metabolism.",
  FTO: "FTO risk variants are associated with weight-gain tendency.",
  LCT: "Lactase non-persistence suggests lactose intolerance tendency.",
  HFE: "HFE variants may relate to iron metabolism.",
  CYP1A2: "CYP1A2 slow variants affect caffeine metabolism.",
};

onMounted(async () => {
  try {
    const saved = await api.getGenetics();
    if (saved) {
      result.value = {
        riskScore: saved.riskScore,
        summary: saved.summary,
        findings: saved.findings,
        recommendations: saved.recommendations,
      };
      if (saved.variants) Object.assign(variants, saved.variants);
    }
  } catch {
  } finally {
    loading.value = false;
  }
});

function scoreVariant(name: string, value: string) {
  const v = value.toLowerCase();
  if (name === "APOE") return v.includes("e4") ? 12 : 4;
  if (name === "MTHFR")
    return v.includes("homozygous") ? 10 : v.includes("heterozygous") ? 6 : 0;
  if (name === "FTO") return v.includes("risk") ? 8 : 0;
  if (name === "LCT") return v.includes("absent") ? 4 : 0;
  if (name === "HFE")
    return v.includes("positive") ? 8 : v.includes("carrier") ? 4 : 0;
  if (name === "CYP1A2") return v.includes("slow") ? 4 : 0;
  return 0;
}

const analyze = async () => {
  let riskScore = 20;
  const findings: any[] = [];
  const recs = new Set<string>();
  for (const gene of genes) {
    const value = variants[gene.name];
    if (!value) continue;
    const add = scoreVariant(gene.name, value);
    riskScore += add;
    const status = add >= 8 ? "high" : add >= 4 ? "low" : "normal";
    findings.push({
      label: gene.name,
      status,
      value,
      note: variantNotes[gene.name],
    });
    if (gene.name === "APOE" && value.includes("E4"))
      recs.add("Follow a heart-healthy, low saturated-fat diet.");
    if (gene.name === "MTHFR")
      recs.add("Review folate, B12, and homocysteine levels.");
    if (gene.name === "FTO" && value.includes("Risk"))
      recs.add("Prioritise regular physical activity and protein-rich meals.");
    if (gene.name === "LCT" && value.includes("absent"))
      recs.add("Reduce lactose or switch to lactose-free alternatives.");
    if (gene.name === "HFE" && value !== "Negative")
      recs.add("Review iron levels before taking iron supplements.");
    if (gene.name === "CYP1A2" && value.includes("Slow"))
      recs.add("Limit caffeine intake.");
  }
  riskScore = Math.min(90, Math.max(10, riskScore));
  if (recs.size === 0)
    recs.add(
      "Maintain a balanced diet, regular exercise, and periodic health screening.",
    );
  const payload = {
    riskScore,
    summary: findings.length
      ? "Genetic profile shows actionable lifestyle and nutrition considerations."
      : "No variants entered.",
    findings,
    recommendations: [...recs],
    variants: { ...variants },
  };
  saving.value = true;
  try {
    await api.saveGenetics(payload);
    result.value = payload;
  } finally {
    saving.value = false;
  }
};
</script>
