<template>
  <div class="min-h-screen bg-[#f6f8fc] text-slate-900">
    <div class="flex min-h-screen">
      <!-- Sidebar -->
      <aside
        class="hidden xl:fixed xl:inset-y-0 xl:flex xl:w-80 xl:flex-col bg-white/85 backdrop-blur-xl border-r border-slate-200/80 shadow-[10px_0_40px_rgba(15,23,42,0.04)]"
      >
        <div class="px-7 py-6 border-b border-slate-200/80">
          <div class="flex items-center gap-4">
            <div
              class="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 shadow-lg shadow-cyan-200/60 flex items-center justify-center text-white font-black text-xl"
            >
              M
            </div>
            <div>
              <h1 class="text-xl font-bold tracking-tight text-slate-950">
                Medivoy
              </h1>
              <p class="text-xs font-medium text-slate-500">
                Preventive Health OS
              </p>
            </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-5">
          <div
            class="mb-5 rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-5 text-white shadow-xl"
          >
            <p class="text-xs uppercase tracking-[0.22em] text-cyan-300">
              Health intelligence
            </p>
            <h2 class="mt-3 text-lg font-semibold leading-7">
              Reports, genetics, family risk, nutrition, and longevity in one
              place.
            </h2>
            <div class="mt-4 grid grid-cols-2 gap-3">
              <div class="rounded-2xl bg-white/8 border border-white/10 p-3">
                <p class="text-[11px] text-slate-300">Score</p>
                <p class="mt-1 text-xl font-bold text-cyan-300">
                  {{ scoreDisplay }}
                </p>
              </div>
              <div class="rounded-2xl bg-white/8 border border-white/10 p-3">
                <p class="text-[11px] text-slate-300">Reports</p>
                <p class="mt-1 text-xl font-bold text-emerald-300">
                  {{ reportsCount }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400"
          >
            Navigation
          </div>
          <nav class="space-y-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="nav-item"
              active-class="nav-item-active"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="flex-1">{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500"
                >{{ item.badge }}</span
              >
            </NuxtLink>
          </nav>
        </div>

        <div class="p-4 border-t border-slate-200/80 bg-white/70">
          <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p
              class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
            >
              Signed in as
            </p>
            <p class="mt-2 truncate text-sm font-semibold text-slate-900">
              {{ auth.user?.email || "Guest" }}
            </p>
            <p class="mt-1 text-xs text-slate-500">
              {{ auth.user?.role || "patient" }}
            </p>
          </div>
          <button
            @click="logout"
            class="mt-3 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </aside>

      <!-- Content -->
      <div class="flex-1 xl:pl-80">
        <header
          class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl"
        >
          <div
            class="flex h-18 items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
          >
            <div class="flex items-center gap-3">
              <button
                class="xl:hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm"
              >
                Menu
              </button>
              <div>
                <h2 class="text-lg font-bold text-slate-950">{{ title }}</h2>
                <p class="text-xs text-slate-500">{{ subtitle }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="hidden sm:block text-right">
                <p class="text-sm font-semibold text-slate-900">
                  {{ auth.user?.name || "Medivoy user" }}
                </p>
                <p class="text-xs text-slate-500">
                  {{ auth.user?.email || "Guest" }}
                </p>
              </div>
              <div
                class="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md"
              >
                {{ initials }}
              </div>
            </div>
          </div>
        </header>

        <main class="px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div class="mx-auto max-w-7xl">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

declare function useAuthStore(): any;
declare function useMedivoyApi(): { getReports: () => Promise<any[]> };

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const reports = ref<any[]>([]);

const navItems = computed(() => [
  { label: "Dashboard", to: "/dashboard", icon: "🏠" },
  {
    label: "Reports",
    to: "/reports",
    icon: "📋",
    badge: reports.value.length ? String(reports.value.length) : "",
  },
  { label: "Upload report", to: "/reports/upload", icon: "⬆️" },
  { label: "Family health", to: "/family", icon: "👨‍👩‍👧" },
  { label: "Nutrition", to: "/nutrition", icon: "🥦" },
  { label: "Lab kits", to: "/lab-kits", icon: "🧪" },
  { label: "Genetics", to: "/genetics", icon: "🧬" },
  { label: "Pharmacy", to: "/pharmacy", icon: "💊" },
  { label: "Admin", to: "/admin", icon: "🛡️", badge: auth.isAdmin ? "on" : "" },
]);

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/reports": "Reports",
  "/reports/upload": "Upload Report",
  "/family": "Family Health",
  "/nutrition": "Nutrition",
  "/lab-kits": "Lab Kits",
  "/genetics": "Genetics",
  "/pharmacy": "Pharmacy",
  "/admin": "Admin",
};

const subtitleMap: Record<string, string> = {
  "/dashboard": "Overview of your health intelligence",
  "/reports": "Manage uploaded reports",
  "/reports/upload": "Upload and analyze a new report",
  "/family": "Track hereditary and family history",
  "/nutrition": "View diet and vitamin guidance",
  "/lab-kits": "Partner kits and fulfillment",
  "/genetics": "DNA and variant insights",
  "/pharmacy": "Search medicines and find doctors",
  "/admin": "Platform control center",
};

const title = computed(() => routeTitles[route.path] || "Medivoy");
const subtitle = computed(
  () => subtitleMap[route.path] || "Preventive Health OS",
);
const initials = computed(() =>
  (auth.user?.name || auth.user?.email || "M")
    .split(" ")
    .map((v: string) => v[0])
    .slice(0, 2)
    .join("")
    .toUpperCase(),
);
const scoreDisplay = computed(() => auth.user?.healthScore ?? "87");
const reportsCount = computed(() => reports.value.length);

const logout = () => {
  auth.logout();
  router.push("/");
};

onMounted(async () => {
  try {
    reports.value = await useMedivoyApi().getReports();
  } catch {
    reports.value = [];
  }
});
</script>

<style scoped>
@reference "tailwindcss";
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}
.nav-item:hover {
  background-color: #f8fafc;
  color: #0f172a;
}
.nav-item-active {
  background-image: linear-gradient(to right, #eff6ff, #ecfeff);
  color: #0f172a;
  box-shadow: inset 0 0 0 1px #bfdbfe;
}
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
  background-color: #f8fafc;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}
.nav-item:hover .nav-icon {
  background-color: #ffffff;
}
</style>
