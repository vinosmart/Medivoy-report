<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-slate-900">Genetics</h3>
      <p class="text-sm text-slate-500">
        Enter genetic markers to get a personalised health risk profile.
      </p>
    </div>

    <div
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <p class="font-semibold text-slate-800">Upload DNA report</p>
      <p class="text-xs text-slate-500">
        Upload a DNA report PDF or TXT. We extract APOE, MTHFR, FTO, LCT, HFE,
        and other key variants automatically.
      </p>
      <NuxtLink
        to="/reports/upload"
        class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >Upload DNA report</NuxtLink
      >
    </div>

    <div
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <p class="font-semibold text-slate-800">Or enter variants manually</p>
      <div class="grid gap-4 sm:grid-cols-2">
        <div v-for="gene in genes" :key="gene.name" class="space-y-1">
          <label class="text-xs font-medium text-slate-600">{{
            gene.name
          }}</label>
          <select
            v-model="variants[gene.name]"
            class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
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
        class="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {{ saving ? "Saving..." : "Analyze variants" }}
      </button>
    </div>

    <div v-if="loading" class="space-y-3 animate-pulse">
      <div class="h-24 rounded-3xl bg-slate-100"></div>
    </div>

    <div v-else-if="result" class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-xs text-slate-500">Genetic risk score</p>
          <p
            class="mt-2 text-3xl font-bold"
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
        </div>
        <div
          class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2"
        >
          <p class="text-xs text-slate-500">Summary</p>
          <p class="mt-2 text-sm leading-6 text-slate-700">
            {{ result.summary }}
          </p>
        </div>
      </div>
      <div
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
      >
        <p class="font-semibold text-slate-800">Variant findings</p>
        <div class="space-y-2">
          <div
            v-for="(f, i) in result.findings"
            :key="i"
            class="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between">
              <p class="font-semibold text-slate-800 text-sm">{{ f.label }}</p>
              <span
                class="rounded-full px-2.5 py-1 text-xs font-semibold"
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
            <p class="text-xs text-slate-500 mt-1">{{ f.value }}</p>
            <p v-if="f.note" class="text-xs text-slate-600 mt-1">
              {{ f.note }}
            </p>
          </div>
        </div>
      </div>
      <div
        class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
      >
        <p class="font-semibold text-slate-800">Personalised recommendations</p>
        <ul class="space-y-2">
          <li
            v-for="(r, i) in result.recommendations"
            :key="i"
            class="text-sm text-slate-700"
          >
            • {{ r }}
          </li>
        </ul>
      </div>
    </div>
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
