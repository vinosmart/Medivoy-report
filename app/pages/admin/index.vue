<template>
  <div class="space-y-6">
    <PageHeading
      :icon="IconShield"
      eyebrow="Admin console"
      title="Platform overview"
      description="Review user accounts, reports, lab activity, and partner workflows."
    />

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm text-slate-500">{{ stat.label }}</p>
          <div
            class="grid size-10 place-items-center rounded-xl bg-cyan-50 text-cyan-800"
          >
            <component
              :is="stat.icon"
              :size="19"
              :stroke-width="1.8"
              aria-hidden="true"
            />
          </div>
        </div>
        <p class="mt-3 text-3xl font-bold text-slate-950">{{ stat.value }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ stat.help }}</p>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-12">
      <div
        class="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-7"
      >
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 class="text-lg font-semibold text-slate-950">Recent reports</h4>
            <p class="text-sm text-slate-500">
              Latest analysis jobs and statuses
            </p>
          </div>
          <NuxtLink
            to="/reports"
            class="text-sm font-semibold text-blue-600 hover:underline"
            >View all</NuxtLink
          >
        </div>
        <div v-if="loading" class="space-y-3 animate-pulse">
          <div
            v-for="n in 4"
            :key="n"
            class="h-16 rounded-2xl bg-slate-100"
          ></div>
        </div>
        <div v-else class="space-y-3">
          <article
            v-for="r in recentReports"
            :key="r.id"
            class="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
          >
            <div
              class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="truncate text-sm font-semibold text-slate-950">
                    {{ r.title }}
                  </p>
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="statusClass(r.status)"
                    >{{ r.status }}</span
                  >
                </div>
                <p class="mt-1 text-xs text-slate-500">
                  {{ r.type?.toUpperCase() }} · User:
                  {{ r.userEmail || r.userId || "-" }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-400">Risk</p>
                <p class="text-lg font-bold" :class="riskClass(r.riskScore)">
                  {{ r.riskScore ?? "-" }}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div
        class="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-5"
      >
        <div class="mb-4">
          <h4 class="text-lg font-semibold text-slate-950">Top users</h4>
          <p class="text-sm text-slate-500">
            Users with most reports and activity
          </p>
        </div>
        <div v-if="loading" class="space-y-3 animate-pulse">
          <div
            v-for="n in 4"
            :key="n"
            class="h-14 rounded-2xl bg-slate-100"
          ></div>
        </div>
        <div v-else class="space-y-3">
          <article
            v-for="u in topUsers"
            :key="u.userId"
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-950">
                  {{ u.name || u.email || u.userId }}
                </p>
                <p class="text-xs text-slate-500">
                  {{ u.email || "No email" }}
                </p>
              </div>
              <span
                class="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700"
                >{{ u.count }} reports</span
              >
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-3">
      <div
        class="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2"
      >
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 class="text-lg font-semibold text-slate-950">All users</h4>
            <p class="text-sm text-slate-500">
              Accounts with report counts and latest activity
            </p>
          </div>
          <label class="sr-only" for="user-search">Search users</label>
          <div class="relative w-full sm:max-w-xs">
            <IconSearch
              :size="17"
              :stroke-width="1.8"
              class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="user-search"
              v-model="userSearch"
              type="search"
              :placeholder="animatedUserSearchPlaceholder"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-cyan-700 focus:bg-white focus:ring-4 focus:ring-cyan-100"
            />
          </div>
        </div>
        <div class="overflow-hidden rounded-xl border border-slate-200">
          <div class="max-h-[480px] overflow-auto">
            <table class="min-w-[720px] w-full divide-y divide-slate-200 text-sm">
              <thead
                class="sticky top-0 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"
              >
                <tr>
                  <th class="px-4 py-3">User</th>
                  <th class="px-4 py-3">Role</th>
                  <th class="px-4 py-3">Reports</th>
                  <th class="px-4 py-3">Family</th>
                  <th class="px-4 py-3">Genetics</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr
                  v-for="u in filteredUsers"
                  :key="u.userId"
                  class="hover:bg-slate-50"
                >
                  <td class="px-4 py-3">
                    <p class="font-semibold text-slate-950">
                      {{ u.name || u.email || u.userId }}
                    </p>
                    <p class="text-xs text-slate-500">
                      {{ u.email || "No email" }}
                    </p>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                      >{{ u.role || "patient" }}</span
                    >
                  </td>
                  <td class="px-4 py-3 font-semibold text-slate-900">
                    {{ u.reportCount }}
                  </td>
                  <td class="px-4 py-3 font-semibold text-slate-900">
                    {{ u.familyCount }}
                  </td>
                  <td class="px-4 py-3 font-semibold text-slate-900">
                    {{ u.hasGenetics ? "Yes" : "No" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h4 class="text-lg font-semibold text-slate-950">Lab & workflow</h4>
        <p class="mt-1 text-sm text-slate-500">
          Kit orders, dispatched samples and partner lab work
        </p>
        <div class="mt-4 space-y-3">
          <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p class="text-xs text-slate-500">Total orders</p>
            <p class="mt-1 text-2xl font-bold text-slate-950">
              {{ stats.find((s) => s.label === "Orders")?.value }}
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p class="text-xs text-slate-500">Completed reports</p>
            <p class="mt-1 text-2xl font-bold text-slate-950">
              {{ stats.find((s) => s.label === "Completed reports")?.value }}
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p class="text-xs text-slate-500">Failed jobs</p>
            <p class="mt-1 text-2xl font-bold text-slate-950">
              {{ stats.find((s) => s.label === "Failed jobs")?.value }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import IconAlertTriangle from "@tabler/icons-vue/icons/IconAlertTriangle";
import IconCircleCheck from "@tabler/icons-vue/icons/IconCircleCheck";
import IconClipboardList from "@tabler/icons-vue/icons/IconClipboardList";
import IconDna from "@tabler/icons-vue/icons/IconDna";
import IconFiles from "@tabler/icons-vue/icons/IconFiles";
import IconShield from "@tabler/icons-vue/icons/IconShield";
import IconSearch from "@tabler/icons-vue/icons/IconSearch";
import IconUsersGroup from "@tabler/icons-vue/icons/IconUsersGroup";

definePageMeta({ middleware: "auth" });

const api = useMedivoyApi();
const loading = ref(true);
const userSearch = ref("");
const animatedUserSearchPlaceholder = useAnimatedPlaceholder([
  "Search users",
  "Search by email",
  "Search by name",
]);
const users = ref<any[]>([]);
const reports = ref<any[]>([]);
const familyMembers = ref<any[]>([]);
const orders = ref<any[]>([]);
const genetics = ref<any[]>([]);

const riskClass = (score?: number) =>
  !score
    ? "text-slate-500"
    : score >= 60
      ? "text-rose-600"
      : score >= 30
        ? "text-amber-600"
        : "text-emerald-600";
const statusClass = (status?: string) =>
  status === "completed"
    ? "bg-emerald-100 text-emerald-700"
    : status === "failed"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-700";

const stats = computed(() => [
  {
    label: "Users",
    value: String(users.value.length),
    help: "Registered accounts",
    icon: IconUsersGroup,
  },
  {
    label: "Reports",
    value: String(reports.value.length),
    help: "Uploaded reports",
    icon: IconFiles,
  },
  {
    label: "Orders",
    value: String(orders.value.length),
    help: "Kit orders placed",
    icon: IconClipboardList,
  },
  {
    label: "Completed reports",
    value: String(
      reports.value.filter((r: any) => r.status === "completed").length,
    ),
    help: "AI analysis complete",
    icon: IconCircleCheck,
  },
  {
    label: "Failed jobs",
    value: String(
      reports.value.filter((r: any) => r.status === "failed").length,
    ),
    help: "Processing errors",
    icon: IconAlertTriangle,
  },
  {
    label: "Genetics profiles",
    value: String(genetics.value.length),
    help: "Saved DNA analyses",
    icon: IconDna,
  },
]);

const userMap = computed(() => {
  const map = new Map<string, any>();
  for (const u of users.value)
    map.set(u.id || u.userId, {
      userId: u.id || u.userId,
      name: u.name,
      email: u.email,
      role: u.role || "patient",
      reportCount: 0,
      familyCount: 0,
      hasGenetics: false,
    });
  const ensure = (id: string, defaults: any = {}) => {
    if (!map.has(id))
      map.set(id, {
        userId: id,
        name: defaults.name,
        email: defaults.email,
        role: defaults.role || "patient",
        reportCount: 0,
        familyCount: 0,
        hasGenetics: false,
      });
    return map.get(id);
  };
  for (const r of reports.value) {
    const u = ensure(r.userId, { email: r.userEmail });
    u.reportCount += 1;
  }
  for (const f of familyMembers.value) {
    const u = ensure(f.userId);
    u.familyCount += 1;
  }
  for (const g of genetics.value) {
    const u = ensure(g.userId);
    u.hasGenetics = true;
  }
  return [...map.values()];
});

const filteredUsers = computed(() => {
  const q = userSearch.value.trim().toLowerCase();
  if (!q) return userMap.value;
  return userMap.value.filter((u: any) =>
    [u.name, u.email, u.role, u.userId]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q)),
  );
});

const recentReports = computed(() =>
  [...reports.value]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8),
);
const topUsers = computed(() =>
  [...userMap.value]
    .sort((a: any, b: any) => b.reportCount - a.reportCount)
    .slice(0, 5),
);

onMounted(async () => {
  try {
    const [u, r, f, o, g] = await Promise.allSettled([
      api.getUsers?.(),
      api.getReports?.(),
      api.getFamilyMembers?.(),
      api.getOrders?.(),
      api.getGenetics?.(),
    ]);
    if (u.status === "fulfilled" && u.value) users.value = u.value;
    if (r.status === "fulfilled" && r.value) reports.value = r.value;
    if (f.status === "fulfilled" && f.value) familyMembers.value = f.value;
    if (o.status === "fulfilled" && o.value) orders.value = o.value;
    if (g.status === "fulfilled" && g.value)
      genetics.value = Array.isArray(g.value)
        ? g.value
        : g.value
          ? [g.value]
          : [];
  } catch {
  } finally {
    loading.value = false;
  }
});
</script>
