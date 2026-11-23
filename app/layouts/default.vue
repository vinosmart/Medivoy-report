<template>
  <div class="medivoy-page-background min-h-screen text-slate-900">
    <button
      v-if="mobileNavOpen"
      type="button"
      class="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
      aria-label="Close navigation"
      @click="mobileNavOpen = false"
    ></button>

    <aside
      class="sidebar-shell fixed bottom-0 left-0 top-0 z-40 flex w-72 max-w-[calc(100vw-2rem)] -translate-x-full flex-col border-r border-cyan-100 bg-[#edf6f7] shadow-[8px_0_30px_rgba(16,42,67,0.08)] transition-transform duration-300 ease-out lg:top-0 lg:translate-x-0 lg:shadow-none"
      :class="{
        'sidebar-shell--mobile-open': mobileNavOpen,
        'sidebar-shell--desktop-collapsed': desktopSidebarCollapsed,
      }"
      id="app-sidebar"
      aria-label="Main sidebar"
    >
      <div class="sidebar-brand border-b border-cyan-200/70 bg-gradient-to-br from-cyan-100/80 via-cyan-50/80 to-[#edf6f7] px-5 pb-4 pt-5">
        <NuxtLink
          to="/dashboard"
          class="block min-w-0 rounded-xl focus-visible:outline-cyan-700"
          draggable="false"
          @click="mobileNavOpen = false"
        >
          <img
            src="~/assets/images/medivoy-logo-transparent.png"
            alt="Medivoy"
            class="block h-auto w-48 max-w-full"
            fetchpriority="high"
            draggable="false"
          />
          <span class="sidebar-compact-mark">
            <img
              src="~/assets/images/medivoy-mark.png"
              alt="Medivoy"
              class="sidebar-compact-mark__logo"
            />
          </span>
        </NuxtLink>
        <p class="sidebar-tagline mt-2 max-w-full text-xs leading-5 text-slate-600">
          Clear health insights for better decisions.
        </p>
      </div>

      <div class="sidebar-navigation flex-1 overflow-y-auto px-3 py-5">
        <section
          aria-label="Health overview"
          class="fade-up sidebar-overview mb-5 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-white p-4 shadow-[0_10px_24px_-22px_rgba(14,116,144,0.45)]"
        >
          <div class="flex items-center gap-3">
            <span
              class="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-cyan-800 ring-1 ring-cyan-100"
            >
              <IconActivityHeartbeat
                :size="19"
                :stroke-width="1.8"
                aria-hidden="true"
              />
            </span>
            <div>
              <p class="text-sm font-semibold text-slate-900">
                Health overview
              </p>
              <p class="mt-0.5 text-xs text-slate-500">
                Your latest activity
              </p>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <div class="rounded-xl border border-slate-100 bg-white p-3">
              <p class="text-xs text-slate-500">Health score</p>
              <p class="mt-1 truncate text-sm font-semibold text-slate-900">
                {{ scoreDisplay }}
              </p>
            </div>
            <div class="rounded-xl border border-slate-100 bg-white p-3">
              <p class="text-xs text-slate-500">Reports</p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ reportsCount }}
              </p>
            </div>
          </div>
        </section>

        <p class="sidebar-section-label mb-2 px-3 text-xs font-semibold text-slate-400">
          Your workspace
        </p>
        <nav class="space-y-1.5" aria-label="Main navigation">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :aria-label="item.label"
            :title="item.label"
            active-class="nav-item--active"
            @click="mobileNavOpen = false"
          >
            <component
              :is="item.icon"
              :size="19"
              :stroke-width="1.8"
              class="shrink-0"
              aria-hidden="true"
            />
            <span class="sidebar-label min-w-0 flex-1">{{ item.label }}</span>
            <span v-if="item.badge" class="sidebar-badge nav-badge">{{ item.badge }}</span>
          </NuxtLink>
        </nav>
      </div>

      <div class="sidebar-footer border-t border-cyan-100 bg-cyan-50/70 p-3">
        <NuxtLink
          to="/profile"
          class="sidebar-account mb-2 flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
          :aria-current="route.path === '/profile' ? 'page' : undefined"
          aria-label="Open profile"
          title="Profile"
        >
          <span class="grid size-10 shrink-0 place-items-center rounded-full bg-cyan-50 text-cyan-800 ring-1 ring-cyan-100">
            <IconUserCircle
              :size="21"
              :stroke-width="1.8"
              aria-hidden="true"
            />
          </span>
          <span class="min-w-0">
            <p class="truncate text-sm font-semibold text-slate-800">
              {{ auth.user?.name || "Your account" }}
            </p>
            <p class="truncate text-xs text-slate-500">
              {{ auth.user?.email || "Guest" }}
            </p>
          </span>
        </NuxtLink>
        <button type="button" class="sign-out-button" aria-label="Sign out" title="Sign out" @click="logout">
          <IconLogout2 :size="18" :stroke-width="1.8" aria-hidden="true" />
          <span class="sidebar-label">Sign out</span>
        </button>
      </div>
    </aside>

    <Transition name="route">
      <nav
        v-if="mobileNavOpen"
        id="mobile-navigation"
        class="mobile-nav-panel lg:hidden"
        aria-label="Mobile navigation"
      >
        <div class="mobile-nav-panel__header">
          <NuxtLink
            to="/profile"
            role="menuitem"
            class="account-menu__action"
            @click="accountMenuOpen = false"
          >
            <span class="account-menu__action-icon">
              <IconUserCircle :size="17" :stroke-width="1.8" aria-hidden="true" />
            </span>
            <span>Profile</span>
            <IconChevronRight :size="16" class="ml-auto text-slate-400" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink
            to="/dashboard"
            class="mobile-nav-panel__brand"
            draggable="false"
            @click="mobileNavOpen = false"
          >
            <img
              src="~/assets/images/medivoy-logo-transparent.png"
              alt="Medivoy"
              draggable="false"
            />
          </NuxtLink>
          <button
            type="button"
            class="mobile-nav-panel__close"
            aria-label="Close navigation"
            @click="mobileNavOpen = false"
          >
            <IconX :size="19" :stroke-width="1.8" aria-hidden="true" />
          </button>
        </div>
        <div class="mobile-nav-list">
          <NuxtLink
            v-for="item in navItems"
            :key="`mobile-${item.to}`"
            :to="item.to"
            class="mobile-nav-item"
            :aria-label="item.label"
            active-class="mobile-nav-item--active"
            @click="mobileNavOpen = false"
          >
            <component
              :is="item.icon"
              :size="21"
              :stroke-width="1.8"
              aria-hidden="true"
            />
            <span class="mobile-nav-item__label">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </nav>
    </Transition>

    <div
      class="layout-content min-h-screen min-w-0"
      :class="{
        'lg:pl-72': !desktopSidebarCollapsed,
        'main-layout--sidebar-collapsed': desktopSidebarCollapsed,
      }"
    >
      <header
        class="fade-up sticky top-0 z-20 border-b border-cyan-100/80 bg-gradient-to-r from-cyan-50/70 via-white/95 to-white/90 backdrop-blur-xl"
        :class="{ 'z-50': navigationOpen }"
      >
        <div class="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div class="flex min-w-0 items-center gap-3">
            <button
              type="button"
              class="menu-button"
              :class="{ 'menu-button--open': mobileNavOpen }"
              :aria-expanded="navigationOpen"
              :aria-controls="isDesktopViewport ? 'app-sidebar' : 'mobile-navigation'"
              :aria-label="
                isDesktopViewport
                  ? desktopSidebarCollapsed
                    ? 'Expand sidebar'
                    : 'Collapse sidebar'
                  : mobileNavOpen
                    ? 'Close navigation'
                    : 'Open navigation'
              "
              @click.stop.prevent="toggleMobileNavigation"
            >
              <IconX v-if="mobileNavOpen" :size="20" aria-hidden="true" />
              <IconMenu2 v-else :size="20" aria-hidden="true" />
            </button>
            <div
              :key="route.path"
              class="min-w-0"
              :class="[
                { 'invisible lg:visible': mobileNavOpen },
                'page-heading-enter',
              ]"
            >
              <h2
                class="truncate text-base font-semibold text-cyan-900 sm:text-lg"
              >
                {{ title }}
              </h2>
              <p
                class="hidden truncate text-xs text-cyan-800 sm:block"
              >
                {{ subtitle }}
              </p>
            </div>
          </div>

          <div
            ref="accountMenu"
            class="relative shrink-0"
            :class="{ 'invisible lg:visible': mobileNavOpen }"
          >
            <button
              type="button"
              class="account-trigger"
              :aria-expanded="accountMenuOpen"
              aria-haspopup="menu"
              aria-label="Open account menu"
              @click.stop="accountMenuOpen = !accountMenuOpen"
            >
              <span class="hidden min-w-0 text-right sm:block">
                <span class="block truncate text-sm font-semibold text-slate-800">
                  {{ auth.user?.name || "Your account" }}
                </span>
                <span class="block truncate text-xs text-slate-500">
                  {{ auth.user?.email || "Guest" }}
                </span>
              </span>
              <span class="account-avatar">
                <IconUserCircle :size="22" :stroke-width="1.8" aria-hidden="true" />
              </span>
              <IconChevronDown :size="16" class="hidden text-slate-400 sm:block" aria-hidden="true" />
            </button>

            <Transition name="route">
              <div
                v-if="accountMenuOpen"
                class="account-menu"
                role="menu"
                aria-label="Account options"
              >
                <div class="account-menu__profile">
                  <span class="account-menu__avatar">
                    <IconUserCircle :size="24" :stroke-width="1.8" aria-hidden="true" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-slate-900">
                      {{ auth.user?.name || "Your account" }}
                    </p>
                    <p class="mt-0.5 truncate text-xs text-slate-500">
                      {{ auth.user?.email || "Guest" }}
                    </p>
                  </div>
                  <span class="account-menu__role">
                    {{ auth.isAdmin ? "Admin" : "Member" }}
                  </span>
                </div>
                <div class="account-menu__links">
                  <NuxtLink
                    to="/dashboard"
                    role="menuitem"
                    class="account-menu__action"
                    @click="accountMenuOpen = false"
                  >
                    <span class="account-menu__action-icon">
                      <IconLayoutDashboard :size="17" :stroke-width="1.8" aria-hidden="true" />
                    </span>
                    <span>Dashboard</span>
                    <IconChevronRight :size="16" class="ml-auto text-slate-400" aria-hidden="true" />
                  </NuxtLink>
                  <NuxtLink
                    to="/family"
                    role="menuitem"
                    class="account-menu__action"
                    @click="accountMenuOpen = false"
                  >
                    <span class="account-menu__action-icon">
                      <IconUsersGroup :size="17" :stroke-width="1.8" aria-hidden="true" />
                    </span>
                    <span>Family health</span>
                    <IconChevronRight :size="16" class="ml-auto text-slate-400" aria-hidden="true" />
                  </NuxtLink>
                </div>
                <div class="border-t border-slate-100 p-2">
                  <button
                    type="button"
                    role="menuitem"
                    class="account-menu__action account-menu__action--danger"
                    @click="logout"
                  >
                    <span class="account-menu__action-icon">
                      <IconLogout2 :size="17" :stroke-width="1.8" aria-hidden="true" />
                    </span>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <div
        v-if="guestMode"
        role="status"
        class="mx-4 mt-4 flex flex-col gap-3 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-950 sm:mx-6 sm:flex-row sm:items-center sm:justify-between lg:mx-8"
      >
        <p>Sign in to load and manage your protected health information.</p>
        <NuxtLink
          to="/"
          class="medivoy-primary-button inline-flex min-h-10 items-center justify-center rounded-xl bg-cyan-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-900"
        >
          Sign in
        </NuxtLink>
      </div>

      <main id="main-content" class="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <Transition name="route" mode="out-in">
          <div :key="route.path" class="page-shell mx-auto max-w-7xl">
            <slot />
          </div>
        </Transition>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Component,
} from "vue";
import IconActivityHeartbeat from "@tabler/icons-vue/icons/IconActivityHeartbeat";
import IconChevronDown from "@tabler/icons-vue/icons/IconChevronDown";
import IconChevronRight from "@tabler/icons-vue/icons/IconChevronRight";
import IconDna from "@tabler/icons-vue/icons/IconDna";
import IconFileUpload from "@tabler/icons-vue/icons/IconFileUpload";
import IconFiles from "@tabler/icons-vue/icons/IconFiles";
import IconLayoutDashboard from "@tabler/icons-vue/icons/IconLayoutDashboard";
import IconLogout2 from "@tabler/icons-vue/icons/IconLogout2";
import IconMenu2 from "@tabler/icons-vue/icons/IconMenu2";
import IconPill from "@tabler/icons-vue/icons/IconPill";
import IconSalad from "@tabler/icons-vue/icons/IconSalad";
import IconShield from "@tabler/icons-vue/icons/IconShield";
import IconTestPipe from "@tabler/icons-vue/icons/IconTestPipe";
import IconUserCircle from "@tabler/icons-vue/icons/IconUserCircle";
import IconUsersGroup from "@tabler/icons-vue/icons/IconUsersGroup";
import IconX from "@tabler/icons-vue/icons/IconX";
import { useRoute, useRouter } from "vue-router";
import {
  getLatestAnalyzedReport,
  readHealthScore,
} from "~/utils/reportMetrics";
import { getDeduplicatedReports } from "~/utils/getDeduplicatedReports";

declare function useAuthStore(): any;
declare function useMedivoyApi(): { getReports: () => Promise<any[]> };

type NavItem = {
  label: string;
  to: string;
  icon: Component;
  badge?: string;
};

const auth = useAuthStore();
const api = useMedivoyApi();
const router = useRouter();
const route = useRoute();
const reports = ref<any[]>([]);
const reportsLoading = ref(false);
const reportsUnavailable = ref(false);
const mobileNavOpen = ref(false);
const desktopSidebarCollapsed = ref(false);
const isDesktopViewport = ref(false);
const guestMode = ref(false);
const accountMenuOpen = ref(false);
const accountMenu = ref<HTMLElement | null>(null);

const navigationOpen = computed(() =>
  isDesktopViewport.value
    ? !desktopSidebarCollapsed.value
    : mobileNavOpen.value,
);

const toggleMobileNavigation = () => {
  isDesktopViewport.value = window.matchMedia("(min-width: 64rem)").matches;
  if (isDesktopViewport.value) {
    desktopSidebarCollapsed.value = !desktopSidebarCollapsed.value;
    return;
  }

  mobileNavOpen.value = !mobileNavOpen.value;
};

const syncViewport = () => {
  isDesktopViewport.value = window.matchMedia("(min-width: 64rem)").matches;
};

const navItems = computed<NavItem[]>(() => [
  { label: "Dashboard", to: "/dashboard", icon: IconLayoutDashboard },
  {
    label: "Reports",
    to: "/reports",
    icon: IconFiles,
    badge: reports.value.length ? String(reports.value.length) : undefined,
  },
  { label: "Upload report", to: "/reports/upload", icon: IconFileUpload },
  { label: "Family health", to: "/family", icon: IconUsersGroup },
  { label: "Nutrition", to: "/nutrition", icon: IconSalad },
  { label: "Lab kits", to: "/lab-kits", icon: IconTestPipe },
  { label: "Genetics", to: "/genetics", icon: IconDna },
  { label: "Pharmacy", to: "/pharmacy", icon: IconPill },
  { label: "Admin", to: "/admin", icon: IconShield },
]);

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/reports": "Reports",
  "/reports/upload": "Upload report",
  "/family": "Family health",
  "/nutrition": "Nutrition",
  "/lab-kits": "Lab kits",
  "/genetics": "Genetics",
  "/pharmacy": "Pharmacy",
  "/admin": "Admin",
};

const subtitleMap: Record<string, string> = {
  "/dashboard": "A clear overview of your health",
  "/profile": "Review your account information",
  "/reports": "Your uploaded health records",
  "/reports/upload": "Add a health record to your profile",
  "/family": "Keep family health history organized",
  "/nutrition": "Guidance based on your health profile",
  "/lab-kits": "Explore home collection options",
  "/genetics": "Review your genetic profile",
  "/pharmacy": "Find medicines and doctors",
  "/admin": "Manage platform activity",
};

const title = computed(
  () =>
    routeTitles[route.path] ||
    (route.path.startsWith("/reports/") ? "Report details" : "Medivoy"),
);
const subtitle = computed(
  () =>
    subtitleMap[route.path] ||
    (route.path.startsWith("/reports/")
      ? "Review the report and its analysis"
      : "Clear health insights for better decisions."),
);

const latestAnalyzedReport = computed(() =>
  getLatestAnalyzedReport(reports.value),
);
const reportHealthScore = computed(() =>
  readHealthScore(
    latestAnalyzedReport.value?.overallHealthScore ??
      latestAnalyzedReport.value?.riskScore,
  ),
);
const scoreDisplay = computed(() => {
  if (reportsLoading.value) return "Loading";

  const score =
    reportHealthScore.value ?? readHealthScore(auth.user?.healthScore);
  if (score !== null) return `${score}/100`;

  return reportsUnavailable.value ? "Unavailable" : "No data";
});
const reportsCount = computed(() => {
  if (reportsLoading.value) return "Loading";
  return reportsUnavailable.value ? "Unavailable" : reports.value.length;
});

const logout = () => {
  accountMenuOpen.value = false;
  mobileNavOpen.value = false;
  auth.logout();
  router.push("/");
};

const handlePointerDown = (event: PointerEvent) => {
  if (!accountMenu.value?.contains(event.target as Node)) {
    accountMenuOpen.value = false;
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    mobileNavOpen.value = false;
    accountMenuOpen.value = false;
  }
};

watch(
  () => route.path,
  () => {
    mobileNavOpen.value = false;
    accountMenuOpen.value = false;
  },
);

onMounted(async () => {
  document.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", syncViewport);
  syncViewport();

  guestMode.value = !auth.token;
  if (!auth.token) return;

  reportsLoading.value = true;
  try {
    reports.value = await getDeduplicatedReports(auth.token, () =>
      api.getReports(),
    );
  } catch {
    reports.value = [];
    reportsUnavailable.value = true;
  } finally {
    reportsLoading.value = false;
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handlePointerDown);
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", syncViewport);
});
</script>

<style scoped>
.sidebar-shell {
  transition:
    width 180ms cubic-bezier(0.2, 0.7, 0.2, 1),
    translate 180ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.layout-content {
  transition: padding-left 180ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.sidebar-label {
  flex: 1 1 auto;
  max-width: 12rem;
  overflow: hidden;
  white-space: nowrap;
  transition:
    max-width 160ms cubic-bezier(0.2, 0.7, 0.2, 1),
    opacity 120ms ease;
}

.sidebar-compact-mark {
  transition:
    opacity 140ms ease,
    transform 180ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

@media (max-width: 63.999rem) {
  .sidebar-shell {
    display: none;
  }
}

.sidebar-shell--mobile-open {
  top: 72px;
  translate: 0 0;
}

.mobile-nav-panel {
  position: fixed;
  top: 72px;
  left: 0.75rem;
  z-index: 45;
  bottom: 0.75rem;
  display: flex;
  width: 224px;
  max-width: calc(100vw - 1.5rem);
  flex-direction: column;
  overflow: visible;
  border: 1px solid #cfe3e8;
  border-radius: 1rem;
  background: rgb(241 248 249 / 0.98);
  padding: 0.625rem 0.5rem;
  box-shadow: 0 18px 42px -24px rgb(14 116 144 / 0.28);
  backdrop-filter: blur(16px);
}

.mobile-nav-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-bottom: 1px solid #d7e8eb;
  padding: 0 0 0.625rem;
}

.mobile-nav-panel__brand {
  display: block;
  min-width: 0;
  border-radius: 0.5rem;
}

.mobile-nav-panel__brand img {
  display: block;
  width: 8.5rem;
  max-width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
}

.sidebar-brand > a > img {
  user-select: none;
  -webkit-user-drag: none;
}

.mobile-nav-panel__close {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 0.875rem;
  background: #e6f2f4;
  color: #35556a;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.mobile-nav-panel__close:hover {
  background: #dceef1;
  color: #0e5c70;
}

.mobile-nav-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  gap: 0.25rem;
  overflow-y: auto;
  padding-top: 0.625rem;
}

.mobile-nav-item {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 44px;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid transparent;
  border-radius: 0.75rem;
  padding: 0 0.75rem;
  color: #526579;
  text-align: left;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.mobile-nav-item:active {
  transform: scale(0.97);
}

.mobile-nav-item__label {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
}

.mobile-nav-item:focus-visible {
  outline: 2px solid #0e7490;
  outline-offset: 2px;
}

.mobile-nav-item:hover,
.mobile-nav-item--active {
  border-color: #bfe0e5;
  background: #dff1f4;
  color: #0e5c70;
}

.mobile-nav-item--active::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: -0.5rem;
  width: 3px;
  border-radius: 0 999px 999px 0;
  background: #0e7490;
  content: "";
}

@media (max-width: 16rem) {
  .sidebar-shell {
    width: 4.5rem;
    max-width: calc(100vw - 1rem);
  }

  .sidebar-brand {
    padding: 0.5rem;
  }

  .sidebar-brand img {
    width: 3.25rem;
  }

  .sidebar-tagline,
  .sidebar-overview,
  .sidebar-section-label,
  .sidebar-label,
  .sidebar-badge,
  .sidebar-account {
    display: none;
  }

  .sidebar-navigation {
    padding: 0.5rem 0.25rem;
  }

  .nav-item {
    justify-content: center;
    gap: 0;
    padding-inline: 0;
  }

  .sidebar-footer {
    padding: 0.5rem;
  }

  .sign-out-button {
    width: 2.75rem;
    margin-inline: auto;
    padding: 0;
  }
}

@media (min-width: 64rem) {
  .sidebar-shell--desktop-collapsed {
    width: 5rem;
    translate: 0;
  }

  .sidebar-shell--desktop-collapsed .sidebar-brand {
    display: grid;
    min-height: 5rem;
    place-items: center;
    padding: 0.75rem;
  }

  .sidebar-shell--desktop-collapsed .sidebar-brand > a > img,
  .sidebar-shell--desktop-collapsed .sidebar-tagline,
  .sidebar-shell--desktop-collapsed .sidebar-overview,
  .sidebar-shell--desktop-collapsed .sidebar-section-label,
  .sidebar-shell--desktop-collapsed .sidebar-badge {
    display: none;
  }

  .sidebar-shell--desktop-collapsed .sidebar-account {
    justify-content: center;
    gap: 0;
    border-color: transparent;
    background: transparent;
    padding: 0;
  }

  .sidebar-shell--desktop-collapsed .sidebar-account:hover {
    border-color: #cfe4e9;
    background: #fff;
  }

  .sidebar-shell--desktop-collapsed .sidebar-account > span:last-child {
    display: none;
  }

  .sidebar-shell--desktop-collapsed .sidebar-label {
    flex: 0 0 0;
    max-width: 0;
    opacity: 0;
  }

  .sidebar-shell--desktop-collapsed .sidebar-compact-mark {
    display: grid;
    animation: compact-mark-enter 180ms ease both;
  }

  .sidebar-shell--desktop-collapsed .sidebar-navigation {
    padding-inline: 0.5rem;
  }

  @keyframes compact-mark-enter {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .sidebar-shell--desktop-collapsed .nav-item {
    justify-content: center;
    gap: 0;
    padding-inline: 0;
  }

  .sidebar-shell--desktop-collapsed .sidebar-footer {
    padding: 0.5rem;
  }

  .sidebar-shell--desktop-collapsed .sign-out-button {
    justify-content: center;
    padding-inline: 0;
  }

  .sidebar-shell--desktop-collapsed .sign-out-button .sidebar-label {
    display: none;
  }

  .main-layout--sidebar-collapsed {
    padding-left: 5rem;
  }
}

.nav-item {
  display: flex;
  min-height: 46px;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid transparent;
  border-radius: 0.875rem;
  padding: 0.6rem 0.75rem;
  color: var(--medivoy-muted);
  font-size: 0.875rem;
  font-weight: 500;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.sidebar-compact-mark {
  position: relative;
  display: none;
  width: 42px;
  height: 42px;
  place-items: center;
  overflow: hidden;
  border: 1px solid #cde5ea;
  border-radius: 0.875rem;
  background: #eaf7f9;
}

.sidebar-compact-mark__logo {
  display: block;
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.nav-item:hover {
  background-color: #e4f1f3;
  color: var(--medivoy-ink);
}

.nav-item:active {
  transform: scale(0.985);
}

.nav-item--active {
  border-color: #bfe0e5;
  background: linear-gradient(90deg, #dff1f4, #edf7f8);
  box-shadow: inset 3px 0 0 var(--medivoy-accent);
  color: #0e5c70;
  font-weight: 600;
}

.nav-item--active .nav-badge {
  background: #fff;
  color: #0e5c70;
}

.nav-badge {
  min-width: 1.5rem;
  border-radius: 999px;
  background: #f1f7fa;
  padding: 0.15rem 0.4rem;
  color: var(--medivoy-muted);
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
}

.menu-button,
.account-trigger {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 1px solid var(--medivoy-border);
  background: #fff;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}

.menu-button {
  width: 42px;
  border-radius: 0.875rem;
  color: #334e68;
}

.menu-button:hover,
.account-trigger:hover {
  border-color: #cbd9e5;
  background: #f8fbfd;
  transform: translateY(-1px);
}

.menu-button--open {
  border-color: #cfe4e9;
  background: #eaf6f8;
  color: #0e5c70;
}

.menu-button:active,
.account-trigger:active,
.sign-out-button:active,
.account-menu__action:active {
  transform: scale(0.985);
}

.account-trigger {
  border-color: transparent;
  border-radius: 1rem;
  padding: 0.25rem;
  background: transparent;
}

.account-trigger[aria-expanded="true"] {
  border-color: #d3e9ee;
  background: #eff7f8;
}

.account-avatar {
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--medivoy-accent), #155e75);
  color: #fff;
}

.account-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  z-index: 50;
  width: min(19.5rem, calc(100vw - 2rem));
  overflow: hidden;
  border: 1px solid var(--medivoy-border);
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.12);
  transform-origin: top right;
  animation: account-menu-enter 160ms cubic-bezier(.2, .7, .2, 1);
}

@keyframes account-menu-enter {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.account-menu__profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #eef2f6;
  padding: 0.875rem;
  background: linear-gradient(135deg, #fff, #f7fbfc);
}

.account-menu__avatar {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  flex: 0 0 2.75rem;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--medivoy-accent), #155e75);
  color: #fff;
  box-shadow: 0 8px 18px -12px rgb(14 116 144 / 0.65);
}

.account-menu__role {
  flex-shrink: 0;
  border: 1px solid #d8e9ed;
  border-radius: 999px;
  background: #eff7f8;
  padding: 0.25rem 0.5rem;
  color: #0e5c70;
  font-size: 0.6875rem;
  font-weight: 700;
}

.account-menu__links {
  padding: 0.5rem;
}

.account-menu__action,
.sign-out-button {
  display: flex;
  min-height: 42px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.875rem;
  color: #38536a;
  font-size: 0.875rem;
  font-weight: 600;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.account-menu__action {
  justify-content: flex-start;
  gap: 0.625rem;
  min-height: 44px;
  border-radius: 0.75rem;
  padding: 0.625rem;
}

.account-menu__action:hover {
  background: #edf7f8;
  color: #123047;
}

.account-menu__action-icon {
  display: grid;
  width: 2rem;
  height: 2rem;
  flex: 0 0 2rem;
  place-items: center;
  border-radius: 0.625rem;
  background: #f1f6f8;
  color: #557083;
}

.account-menu__action--danger {
  color: #9f1239;
}

.account-menu__action--danger .account-menu__action-icon {
  background: #fff1f2;
  color: #be123c;
}

.account-menu__action--danger:hover {
  background: #fff1f2;
  color: #881337;
}

.sign-out-button {
  border-color: var(--medivoy-border);
  background: #fff;
}

.sign-out-button:hover {
  border-color: #cbd9e5;
  background: #f8fafc;
  color: #123047;
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .nav-item,
  .menu-button,
  .account-trigger,
  .sign-out-button,
  .account-menu__action {
    transition: none;
  }
}
</style>