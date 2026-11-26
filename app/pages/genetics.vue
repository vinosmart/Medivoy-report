<template>
  <div class="space-y-6">
    <PageHeading
      :icon="IconDna"
      title="Genetic health profile"
      description="Review DNA report findings or enter known variants to build a clear, easy-to-read profile."
      eyebrow="Genetics"
    />

    <section class="grid gap-6 xl:grid-cols-12">
      <div
        class="space-y-6"
        :class="result ? 'xl:col-span-5' : 'xl:col-span-12'"
      >
        <div
          class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:space-y-0"
        >
          <div class="flex items-center justify-between gap-3 sm:flex-1">
            <div>
              <p class="text-base font-semibold text-slate-950">
                Upload DNA report
              </p>
              <p class="mt-1 text-sm text-slate-500">
                Upload a DNA report PDF or TXT. We extract APOE, MTHFR, FTO,
                LCT, HFE, and other key variants automatically.
              </p>
            </div>
            <div
              class="hidden h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-800 sm:flex"
            >
              <IconDna :size="22" :stroke-width="1.8" aria-hidden="true" />
            </div>
          </div>
          <NuxtLink
            to="/reports/upload"
            class="medivoy-primary-button inline-flex shrink-0 items-center justify-center rounded-xl bg-cyan-800 px-4 py-3 text-sm font-semibold text-white! shadow-lg shadow-cyan-900/15 transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 active:scale-[0.98]"
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
              Select the variants you know, then analyze to review your findings.
            </p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div v-for="gene in genes" :key="gene.name" class="space-y-1">
              <label
                :for="`variant-${gene.name}`"
                class="text-xs font-medium uppercase tracking-wide text-slate-500"
                >{{ gene.name }}</label
              >
              <ProfessionalSelect
                :id="`variant-${gene.name}`"
                v-model="variants[gene.name]"
                :options="[{ value: '', label: 'Unknown' }, ...gene.options.map(opt => ({ value: opt, label: opt }))]"
                placeholder="Unknown"
              />
            </div>
          </div>
          <button
            @click="analyze"
            :disabled="saving || loading"
            class="medivoy-primary-button inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconLoader2
              v-if="saving"
              :size="17"
              class="animate-spin"
              aria-hidden="true"
            />
            <IconDna v-else :size="17" aria-hidden="true" />
            {{ saving ? "Saving..." : "Analyze variants" }}
          </button>
          <p
            v-if="actionError"
            role="alert"
            class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            {{ actionError }}
          </p>
        </div>
      </div>

      <div v-if="result" class="space-y-6 xl:col-span-7">
        <div class="space-y-6">
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

      </div>
    </section>

    <div
      v-if="loading"
      role="status"
      class="rounded-2xl border border-cyan-100 bg-white px-4 py-3 text-sm text-slate-600"
    >
      Checking for a saved genetic profile...
    </div>
    <div
      v-else-if="loadError"
      class="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800"
    >
      <p role="alert">{{ loadError }}</p>
      <button
        type="button"
        class="mt-3 font-semibold text-cyan-900 underline underline-offset-2"
        @click="loadGenetics"
      >
        Try again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconDna from "@tabler/icons-vue/icons/IconDna";
import IconLoader2 from "@tabler/icons-vue/icons/IconLoader2";
import { getApiErrorMessage } from "~/utils/apiError";

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
const variants = reactive<Record<string, string>>(
  Object.fromEntries(genes.map(({ name }) => [name, ""])),
);
const result = ref<any | null>(null);
const loading = ref(true);
const saving = ref(false);
const loadError = ref("");
const actionError = ref("");
const variantNotes: Record<string, string> = {
  APOE: "APOE E4 is associated with higher LDL and cardiovascular risk.",
  MTHFR: "MTHFR variants may affect folate metabolism.",
  FTO: "FTO risk variants are associated with weight-gain tendency.",
  LCT: "Lactase non-persistence suggests lactose intolerance tendency.",
  HFE: "HFE variants may relate to iron metabolism.",
  CYP1A2: "CYP1A2 slow variants affect caffeine metabolism.",
};

const loadGenetics = async () => {
  loading.value = true;
  loadError.value = "";
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
  } catch (error) {
    result.value = null;
    loadError.value = getApiErrorMessage(
      error,
      "We couldn't load your genetic profile. Please try again.",
    );
  } finally {
    loading.value = false;
  }
};

onMounted(loadGenetics);

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
  actionError.value = "";
  if (!genes.some((gene) => variants[gene.name])) {
    actionError.value = "Select at least one genetic variant before analyzing.";
    return;
  }

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
    loadError.value = "";
  } catch (error) {
    actionError.value = getApiErrorMessage(
      error,
      "We couldn't save your genetic analysis. Please try again.",
    );
  } finally {
    saving.value = false;
  }
};
</script>
