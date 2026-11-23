<template>
  <div class="min-h-screen bg-white text-slate-900" @click="profileMenuOpen = false" @keydown.esc="logoutConfirmOpen ? closeLogoutConfirm() : (profileMenuOpen = false)">
    <button v-if="mobileMenu" type="button" class="sidebar-overlay" aria-label="Close navigation" @click="mobileMenu = false"></button>
    <div class="flex min-h-screen">
        <Teleport to="body">
          <div
            v-if="logoutConfirmOpen"
            class="logout-confirm-backdrop"
            role="presentation"
            @click.self="closeLogoutConfirm"
            @keydown.esc="closeLogoutConfirm"
          >
            <section
              class="logout-confirm-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-confirm-title"
              aria-describedby="logout-confirm-description"
            >
              <div class="logout-confirm-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10" />
                </svg>
              </div>
              <h2 id="logout-confirm-title">Sign out of Medivoy?</h2>
              <p id="logout-confirm-description">
                You will need to sign in again to access your health workspace.
              </p>
              <div class="logout-confirm-actions">
                <button type="button" class="logout-stay-button" @click="closeLogoutConfirm">
                  Stay signed in
                </button>
                <button type="button" class="logout-confirm-button" @click="confirmLogout">
                  Sign out
                </button>
              </div>
            </section>
          </div>
        </Teleport>
      <!-- Sidebar -->
      <aside
        id="workspace-sidebar"
        :class="['app-sidebar', { 'app-sidebar-open': mobileMenu, 'app-sidebar-collapsed': sidebarCollapsed }]"
      >
        <button
          type="button"
          class="sidebar-toggle"
          :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :aria-expanded="!sidebarCollapsed"
          aria-controls="workspace-sidebar"
          :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path v-if="sidebarCollapsed" d="m9 6 6 6-6 6" />
            <path v-else d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <button type="button" class="sidebar-close" aria-label="Close navigation" @click="mobileMenu = false">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
        <div class="sidebar-brand">
          <div class="brand-row">
            <img :src="medivoyLogo" alt="Medivoy" class="brand-logo" />
            <span class="brand-collapsed-mark" aria-hidden="true">M</span>
            <p class="brand-caption">Personal health workspace</p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-5">
          <div class="nav-label">Health management</div>
          <nav class="workspace-nav" aria-label="Workspace navigation">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="nav-item"
              exact-active-class="nav-item-active"
              :aria-label="sidebarCollapsed ? item.label : undefined"
              :title="sidebarCollapsed ? item.label : undefined"
            >
              <span class="nav-icon" aria-hidden="true">
                <svg v-if="item.icon === 'D'" viewBox="0 0 24 24">
                  <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
                  <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
                  <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
                  <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
                </svg>
                <svg v-else-if="item.icon === 'R'" viewBox="0 0 24 24">
                  <path d="M7 3.5h7l4 4v13H7v-17ZM14 3.5v4h4M10 12h5M10 15.5h5" />
                </svg>
                <svg v-else-if="item.icon === '+'" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <svg v-else-if="item.icon === 'F'" viewBox="0 0 24 24">
                  <circle cx="9" cy="8" r="3" />
                  <path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20M16 5.5a3 3 0 0 1 0 5.8M17 14h.5a3.5 3.5 0 0 1 3.5 3.5V20" />
                </svg>
                <svg v-else-if="item.icon === 'N'" viewBox="0 0 24 24">
                  <path d="M20 4C11 4 5 7.5 5 14a6 6 0 0 0 6 6c6.5 0 9-7 9-16Z" />
                  <path d="M4 21c3-5 7-8 12-11" />
                </svg>
                <svg v-else-if="item.icon === 'L'" viewBox="0 0 24 24">
                  <path d="M9 3h6M10 3v6l-5 8.5A2.3 2.3 0 0 0 7 21h10a2.3 2.3 0 0 0 2-3.5L14 9V3M8 15h8" />
                </svg>
                <svg v-else-if="item.icon === 'G'" viewBox="0 0 24 24">
                  <path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" />
                </svg>
                <svg v-else-if="item.icon === 'P'" viewBox="0 0 24 24">
                  <path d="M8 4h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8ZM8 12h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8ZM12 4v8M12 12v8" />
                </svg>
                <svg v-else viewBox="0 0 24 24">
                  <path d="m12 3 8 3v5c0 4.5-3.2 8-8 10-4.8-2-8-5.5-8-10V6l8-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span class="flex-1">{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="nav-badge"
                >{{ item.badge }}</span
              >
            </NuxtLink>
          </nav>
        </div>

        <div class="sidebar-account">
          <div class="account-card">
            <div class="account-avatar">{{ initials }}</div>
            <div class="account-copy">
              <span class="account-overline">Your account</span>
              <strong>{{ accountName }}</strong>
              <span class="account-email">{{ auth.user?.email || "Guest" }}</span>
            </div>
          </div>
          <button
            @click="openLogoutConfirm"
            class="sign-out"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10" />
            </svg>
            <span class="sign-out-label">Sign out</span>
          </button>
        </div>
      </aside>

      <!-- Content -->
      <div :class="['flex-1', 'xl:pl-80', { 'app-content-collapsed': sidebarCollapsed }]">
        <header
          class="app-header sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl"
        >
          <div
            class="app-header-inner flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
          >
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="mobileMenu = true"
                class="app-menu-button xl:hidden"
                aria-label="Open navigation"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
              <div class="header-titles">
                <h2>{{ title }}</h2>
                <p>{{ subtitle }}</p>
              </div>
            </div>
            <div class="header-account-menu">
              <button
                type="button"
                class="header-profile"
                :aria-expanded="profileMenuOpen"
                aria-haspopup="menu"
                aria-controls="header-profile-menu"
                :aria-label="`${accountName} account menu`"
                @click.stop="profileMenuOpen = !profileMenuOpen"
              >
                <span class="header-profile-copy">
                  <span class="header-user-overline"><i></i> Signed in</span>
                  <span class="header-user-name">{{ accountName }}</span>
                  <span class="header-user-email">{{ auth.user?.email || "Guest" }}</span>
                </span>
                <span class="header-avatar" aria-hidden="true">{{ initials }}</span>
              </button>
              <div
                v-if="profileMenuOpen"
                class="header-profile-menu"
              >
                <div class="profile-menu-account">
                  <span class="profile-menu-avatar" aria-hidden="true">{{ initials }}</span>
                  <div class="profile-menu-copy">
                    <span class="profile-menu-overline">Your account</span>
                    <strong>{{ accountName }}</strong>
                    <span class="profile-menu-email">{{ auth.user?.email || "Guest" }}</span>
                  </div>
                </div>
                <div id="header-profile-menu" role="menu">
                  <button type="button" class="profile-sign-out" role="menuitem" @click="openLogoutConfirm">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10" />
                    </svg>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main class="app-main px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div class="mx-auto max-w-7xl">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import medivoyLogo from "~/assets/images/medivoy-logo-color.png";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

declare function useAuthStore(): any;
declare function useMedivoyApi(): { getReports: () => Promise<any[]> };

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const reports = ref<any[]>([]);
const mobileMenu = ref(false);
const sidebarCollapsed = ref(true);
const profileMenuOpen = ref(false);
const logoutConfirmOpen = ref(false);

watch(sidebarCollapsed, (collapsed) => {
  if (import.meta.client) {
    localStorage.setItem("medivoy_sidebar_collapsed", String(collapsed));
  }
});

const accountName = computed(() => {
  const name = String(auth.user?.name || "").trim();
  if (name) return name;
  const email = String(auth.user?.email || "").trim();
  return email ? email.split("@")[0] : "Medivoy user";
});

watch(
  () => route.fullPath,
  () => {
    mobileMenu.value = false;
    profileMenuOpen.value = false;
  },
);

const navItems = computed(() => [
  { label: "Dashboard", to: "/dashboard", icon: "D" },
  {
    label: "Reports",
    to: "/reports",
    icon: "R",
    badge: reports.value.length ? String(reports.value.length) : "",
  },
  { label: "Upload report", to: "/reports/upload", icon: "+" },
  { label: "Family health", to: "/family", icon: "F" },
  { label: "Nutrition", to: "/nutrition", icon: "N" },
  { label: "Lab kits", to: "/lab-kits", icon: "L" },
  { label: "Genetics", to: "/genetics", icon: "G" },
  { label: "Pharmacy", to: "/pharmacy", icon: "P" },
  { label: "Admin", to: "/admin", icon: "A", badge: auth.isAdmin ? "on" : "" },
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

const openLogoutConfirm = () => {
  profileMenuOpen.value = false;
  mobileMenu.value = false;
  logoutConfirmOpen.value = true;
};

const closeLogoutConfirm = () => {
  logoutConfirmOpen.value = false;
};

const confirmLogout = () => {
  auth.logout();
  logoutConfirmOpen.value = false;
  router.push("/");
};

onMounted(async () => {
  const savedSidebarState = localStorage.getItem("medivoy_sidebar_collapsed");
  if (savedSidebarState === "true" || savedSidebarState === "false") {
    sidebarCollapsed.value = savedSidebarState === "true";
  }

  try {
    reports.value = await useMedivoyApi().getReports();
  } catch {
    reports.value = [];
  }
});
</script>

<style scoped>
@reference "tailwindcss";
.app-sidebar {
  position: fixed;
  z-index: 50;
  inset: 0 auto 0 0;
  display: flex;
  width: 264px;
  flex-direction: column;
  border-right: 1px solid #e4ecf5;
  background: #fff;
  box-shadow: 8px 0 28px rgba(34, 69, 112, 0.045);
  transition: width 0.22s ease;
}
.sidebar-toggle {
  position: absolute;
  z-index: 3;
  top: 46px;
  right: -15px;
  display: grid;
  width: 30px;
  height: 44px;
  place-items: center;
  border: 1px solid #dfe9f6;
  border-radius: 0 9px 9px 0;
  background: #fff;
  color: #6385aa;
  box-shadow: 3px 4px 10px rgba(33, 75, 126, 0.08);
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
}
.sidebar-toggle:hover {
  border-color: #c8ddf5;
  background: #f5f9ff;
  color: #3478cc;
}
.sidebar-toggle svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sidebar-toggle:focus-visible {
  outline: 3px solid rgba(74, 144, 222, 0.35);
  outline-offset: 2px;
}
.sidebar-overlay {
  position: fixed;
  z-index: 49;
  inset: 0;
  border: 0;
  background: rgba(22, 43, 69, 0.38);
  backdrop-filter: blur(4px);
}
.sidebar-close {
  display: none;
}
.sidebar-brand {
  display: flex;
  height: 92px;
  flex: 0 0 auto;
  align-items: center;
  border-bottom: 1px solid #edf2f8;
  padding: 14px 22px;
}
.brand-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}
.brand-logo {
  display: block;
  width: 176px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}
.brand-collapsed-mark {
  display: none;
}
.brand-caption {
  margin: 2px 0 0 2px;
  color: #8498b1;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.app-sidebar > .flex-1.overflow-y-auto {
  padding: 16px 14px;
}
.nav-label {
  margin: 1px 10px 10px;
  color: #8a9db5;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.workspace-nav {
  display: grid;
  gap: 3px;
}
.nav-item {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 10px;
  border: 1px solid transparent;
  border-radius: 11px;
  padding: 4px 9px;
  color: #617894;
  font-family: Poppins, system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}
.nav-item:hover {
  background: #f7faff;
  color: #315d91;
}
.nav-item-active {
  border-color: #e4eefb;
  background: linear-gradient(105deg, #f0f6ff, #f8fbff);
  color: #245d98;
  box-shadow: inset 3px 0 0 #438cdf, 0 2px 8px rgba(52, 120, 204, 0.04);
}
.nav-icon {
  display: flex;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 9px;
  background: #f3f7fc;
  color: #8296b1;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}
.nav-icon svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.nav-item:hover .nav-icon {
  border-color: #e7eef8;
  background: #fff;
  color: #3478cc;
}
.nav-item-active .nav-icon {
  border-color: #0b1c39;
  background: #0b1c39;
  color: #fff;
}
.nav-item > .flex-1 {
  padding-left: 1px;
}
.nav-badge {
  border: 1px solid #e5edf7;
  border-radius: 999px;
  background: #fff;
  padding: 3px 8px;
  color: #7890ae;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.2;
}
.nav-item-active .nav-badge {
  border-color: #d7e7fa;
  background: #eaf3ff;
  color: #3478cc;
}
.sidebar-account {
  flex: 0 0 auto;
  border-top: 1px solid #edf2f8;
  background: #fbfcfe;
  padding: 12px;
}
.account-card {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #274568;
  border-radius: 12px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 9px;
}
.account-avatar {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(169, 210, 255, 0.3);
  border-radius: 10px;
  background: linear-gradient(145deg, #3478cc, #153766);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
.account-copy {
  min-width: 0;
}
.account-copy > span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-overline {
  margin-bottom: 3px;
  color: #a9d2ff;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.account-card .account-copy strong {
  display: block;
  overflow: hidden;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-card .account-copy .account-email {
  margin-top: 3px;
  color: #d3e4f8;
  font-size: 9px;
}
.sign-out {
  display: flex;
  width: 100%;
  height: 36px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: #71839a;
  font-family: Poppins, system-ui, sans-serif;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}
.sign-out svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.sign-out:hover {
  border-color: #e3edf8;
  background: #fff;
  color: #3478cc;
}
.nav-item:focus-visible,
.sign-out:focus-visible,
.sidebar-close:focus-visible {
  outline: 3px solid rgba(74, 144, 222, 0.35);
  outline-offset: 2px;
}
.flex-1.xl\:pl-80 {
  padding-left: 264px;
  transition: padding-left 0.22s ease;
}
.app-sidebar-collapsed {
  width: 76px;
}
.app-sidebar-collapsed .sidebar-brand {
  justify-content: center;
  padding: 14px 8px;
}
.app-sidebar-collapsed .brand-row {
  align-items: center;
}
.app-sidebar-collapsed .brand-logo,
.app-sidebar-collapsed .brand-caption,
.app-sidebar-collapsed .nav-label,
.app-sidebar-collapsed .nav-item > .flex-1,
.app-sidebar-collapsed .nav-badge,
.app-sidebar-collapsed .account-copy,
.app-sidebar-collapsed .sign-out-label {
  display: none;
}
.app-sidebar-collapsed .brand-collapsed-mark {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid #d7e7fa;
  border-radius: 11px;
  background: #edf5ff;
  color: #3478cc;
  font-size: 19px;
  font-weight: 800;
}
.app-sidebar-collapsed > .flex-1.overflow-y-auto {
  padding: 16px 8px;
}
.app-sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 4px;
}
.app-sidebar-collapsed .sidebar-account {
  padding: 10px 8px;
}
.app-sidebar-collapsed .account-card {
  justify-content: center;
  border-color: transparent;
  background: transparent;
  padding: 0;
}
.app-sidebar-collapsed .sign-out {
  width: 40px;
  margin-right: auto;
  margin-left: auto;
}
.flex-1.xl\:pl-80.app-content-collapsed {
  padding-left: 76px;
}
@media (min-width: 1280px) {
  .app-sidebar-collapsed {
    border-right-color: #274568;
    background: linear-gradient(180deg, #0b1c39 0%, #102b53 58%, #153766 100%);
    box-shadow: 8px 0 28px rgba(11, 28, 57, 0.18);
  }
  .app-sidebar-collapsed .sidebar-brand,
  .app-sidebar-collapsed .sidebar-account {
    border-color: rgba(190, 218, 249, 0.14);
  }
  .app-sidebar-collapsed .sidebar-account {
    background: rgba(4, 17, 37, 0.2);
  }
  .app-sidebar-collapsed .sidebar-toggle {
    border-color: #3478cc;
    background: #3478cc;
    color: #fff;
    box-shadow: 3px 4px 12px rgba(4, 17, 37, 0.24);
  }
  .app-sidebar-collapsed .sidebar-toggle:hover {
    border-color: #5b9bea;
    background: #2867b4;
  }
  .app-sidebar-collapsed .brand-collapsed-mark {
    border-color: rgba(169, 210, 255, 0.28);
    background: rgba(109, 176, 255, 0.16);
    color: #d7eaff;
  }
  .app-sidebar-collapsed .nav-item {
    color: #c1d5ed;
  }
  .app-sidebar-collapsed .nav-item:hover {
    border-color: rgba(190, 218, 249, 0.12);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
  .app-sidebar-collapsed .nav-item-active {
    border-color: rgba(169, 210, 255, 0.24);
    background: linear-gradient(105deg, rgba(82, 148, 222, 0.3), rgba(33, 79, 132, 0.42));
    color: #fff;
    box-shadow: inset 3px 0 0 #8fc1f6;
  }
  .app-sidebar-collapsed .nav-icon {
    border-color: transparent;
    background: rgba(255, 255, 255, 0.08);
    color: #b7d7fb;
  }
  .app-sidebar-collapsed .nav-item:hover .nav-icon {
    border-color: rgba(190, 218, 249, 0.2);
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }
  .app-sidebar-collapsed .nav-item-active .nav-icon {
    border-color: #5b9bea;
    background: #3478cc;
    color: #fff;
  }
  .app-sidebar-collapsed .account-avatar {
    border-color: rgba(169, 210, 255, 0.28);
    background: linear-gradient(145deg, #3478cc, #153766);
    color: #fff;
  }
  .app-sidebar-collapsed .sign-out {
    color: #b7d7fb;
  }
  .app-sidebar-collapsed .sign-out:hover {
    border-color: rgba(190, 218, 249, 0.18);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
}
.app-header {
  position: sticky;
  isolation: isolate;
  overflow: hidden;
  min-height: 82px;
  border-color: #e4edf8 !important;
  background: rgba(255, 255, 255, 0.94) !important;
  box-shadow: 0 6px 24px rgba(32, 75, 126, 0.035);
}
.app-header::before {
  position: absolute;
  z-index: -1;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, #4b91e2 0%, #a9cff8 45%, #e9f3ff 100%);
  content: "";
}
.app-header-inner {
  min-height: 80px;
}
.header-titles {
  min-width: 0;
}
.header-titles h2 {
  margin: 0;
  color: #1d3554;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.035em;
}
.header-titles p {
  margin: 4px 0 0;
  color: #7e93ad;
  font-size: 12px;
  line-height: 1.35;
}
.app-menu-button {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #dfe9f6;
  border-radius: 12px;
  background: #fff;
  color: #3e6e9f;
  box-shadow: 0 3px 10px rgba(33, 75, 126, 0.05);
  cursor: pointer;
  transition: 0.18s ease;
}
.app-menu-button:hover {
  border-color: #c8ddf5;
  background: #f6faff;
  color: #3478cc;
}
.app-menu-button svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}
.header-profile {
  display: flex;
  max-width: 340px;
  flex: 0 0 auto;
  align-items: center;
  gap: 12px;
  border: 1px solid #1d3d68;
  border-radius: 15px;
  background:
    radial-gradient(circle at 74% 18%, rgba(84, 166, 255, 0.24), transparent 25%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 7px 8px 7px 14px;
  box-shadow: 0 8px 20px rgba(11, 28, 57, 0.14);
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: inherit;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.header-account-menu {
  position: relative;
  flex: 0 0 auto;
}
.header-profile:hover {
  border-color: #3478cc;
  box-shadow: 0 10px 24px rgba(11, 28, 57, 0.2);
}
.header-profile:focus-visible {
  outline: 3px solid rgba(74, 144, 222, 0.45);
  outline-offset: 3px;
}
.header-profile-menu {
  position: absolute;
  z-index: 40;
  top: calc(100% + 10px);
  right: 0;
  width: 300px;
  max-width: calc(100vw - 24px);
  padding: 9px;
  border: 1px solid #dfe9f6;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(11, 28, 57, 0.16);
}
.profile-menu-account {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px;
  border: 1px solid #e5ecf5;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff 45%, #f7faff);
}
.profile-menu-avatar {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #0b1c39;
  border-radius: 12px;
  background: #0b1c39;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
}
.profile-menu-copy {
  min-width: 0;
}
.profile-menu-copy > span,
.profile-menu-copy > strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.profile-menu-overline {
  margin-bottom: 3px;
  color: #8a9db5;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.profile-menu-copy > strong {
  color: #2e496b;
  font-size: 12px;
  font-weight: 700;
}
.profile-menu-copy .profile-menu-email {
  margin-top: 3px;
  color: #8193aa;
  font-size: 10px;
}
.profile-sign-out {
  display: flex;
  width: fit-content;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 8px;
  margin-left: auto;
  padding: 0 11px;
  border: 1px solid #d6e5f6;
  border-radius: 9px;
  background: #fff;
  color: #3478cc;
  cursor: pointer;
  font-family: Poppins, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 2px 6px rgba(37, 87, 145, 0.035);
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
}
.profile-sign-out:hover,
.profile-sign-out:focus-visible {
  border-color: #a9cff8;
  background: #f3f8ff;
  color: #286bc0;
  transform: translateY(-1px);
}
.profile-sign-out:focus-visible {
  outline: 2px solid #8ab9ed;
  outline-offset: -2px;
}
.profile-sign-out svg {
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.logout-confirm-backdrop {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(11, 28, 57, 0.48);
  padding: 24px;
  backdrop-filter: blur(7px);
}
.logout-confirm-dialog {
  width: min(440px, 100%);
  border: 1px solid #e7edf6;
  border-radius: 20px;
  background: #fff;
  padding: 32px;
  text-align: center;
  box-shadow: 0 28px 70px rgba(11, 28, 57, 0.28);
  animation: logout-dialog-enter 180ms ease-out both;
}
.logout-confirm-icon {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  margin: 0 auto 18px;
  border: 1px solid #0b1c39;
  border-radius: 16px;
  background: #0b1c39;
  color: #fff;
  box-shadow: 0 8px 18px rgba(11, 28, 57, 0.08);
}
.logout-confirm-icon svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.logout-confirm-dialog h2 {
  margin: 0;
  color: #1d3554;
  font-size: 22px;
  font-weight: 760;
  letter-spacing: -0.035em;
}
.logout-confirm-dialog p {
  max-width: 350px;
  margin: 10px auto 24px;
  color: #71839a;
  font-size: 13px;
  line-height: 1.7;
}
.logout-confirm-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.logout-confirm-actions button {
  min-height: 46px;
  border-radius: 11px;
  font: 700 12px Poppins, system-ui, sans-serif;
  cursor: pointer;
  transition: 0.18s ease;
}
.logout-stay-button {
  border: 1px solid #d8e3f1;
  background: #fff;
  color: #4b6684;
}
.logout-stay-button:hover {
  border-color: #9eb8d7;
  background: #f8fbfe;
  color: #245b96;
}
.logout-confirm-button {
  border: 1px solid #f3cfd4;
  background: #fdecef;
  color: #b95d69;
  box-shadow: 0 8px 18px rgba(185, 93, 105, 0.07);
}
.logout-confirm-button:hover {
  border-color: #edaab3;
  background: #fadfe3;
  color: #a94d5a;
  box-shadow: 0 10px 22px rgba(185, 93, 105, 0.12);
  transform: translateY(-1px);
}
@keyframes logout-dialog-enter {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (max-width: 480px) {
  .logout-confirm-dialog {
    padding: 22px 18px 18px;
  }
  .logout-confirm-actions {
    grid-template-columns: 1fr;
  }
}
.header-profile-copy {
  min-width: 0;
  text-align: right;
}
.header-user-overline {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-bottom: 2px;
  color: #a9d2ff;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.header-user-overline i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #43a77b;
  box-shadow: 0 0 0 3px rgba(67, 167, 123, 0.16);
}
.header-user-name,
.header-user-email {
  display: block;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header-user-name {
  margin: 0;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
}
.header-user-email {
  margin: 1px 0 0;
  color: #d3e4f8;
  font-size: 10px;
  line-height: 1.4;
}
.header-avatar {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(169, 210, 255, 0.34);
  border-radius: 12px;
  background: linear-gradient(145deg, #438cdf, #286bc0);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(52, 120, 204, 0.18);
}
@media (max-width: 1279px) {
  .app-sidebar {
    transform: translateX(-102%);
    transition: transform 0.25s ease;
  }
  .sidebar-toggle {
    display: none;
  }
  .app-sidebar-collapsed {
    width: 264px;
  }
  .app-sidebar-collapsed .sidebar-brand {
    justify-content: flex-start;
    padding: 14px 22px;
  }
  .app-sidebar-collapsed .brand-row {
    align-items: flex-start;
  }
  .app-sidebar-collapsed .brand-logo,
  .app-sidebar-collapsed .brand-caption,
  .app-sidebar-collapsed .nav-label,
  .app-sidebar-collapsed .nav-item > .flex-1,
  .app-sidebar-collapsed .account-copy,
  .app-sidebar-collapsed .sign-out-label {
    display: revert;
  }
  .app-sidebar-collapsed .brand-collapsed-mark {
    display: none;
  }
  .app-sidebar-collapsed .nav-badge { display: revert; }
  .app-sidebar-collapsed .brand-logo {
    width: 176px;
  }
  .app-sidebar-collapsed > .flex-1.overflow-y-auto {
    padding: 16px 14px;
  }
  .app-sidebar-collapsed .nav-item {
    justify-content: flex-start;
    padding: 4px 9px;
  }
  .app-sidebar-collapsed .sidebar-account {
    padding: 12px;
  }
  .app-sidebar-collapsed .account-card {
    justify-content: flex-start;
    border-color: #274568;
    background:
      radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
      linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
    padding: 9px;
  }
  .app-sidebar-collapsed .sign-out {
    width: 100%;
    margin: 8px 0 0;
  }
  .flex-1.xl\:pl-80.app-content-collapsed {
    padding-left: 0;
  }
  .app-sidebar-open {
    transform: translateX(0);
  }
  .sidebar-close {
    position: absolute;
    z-index: 2;
    top: 14px;
    right: 14px;
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border: 1px solid #dce7f3;
    border-radius: 11px;
    background: #fff;
    color: #607894;
    cursor: pointer;
  }
  .sidebar-close svg {
    width: 17px;
    height: 17px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
  }
  .flex-1.xl\:pl-80 {
    padding-left: 0;
  }
}
@media (max-width: 640px) {
  .app-header-inner {
    min-height: 72px;
  }
  .app-header {
    min-height: 74px;
  }
  .header-titles h2 {
    font-size: 17px;
  }
  .header-titles p {
    font-size: 10px;
  }
  .header-profile {
    max-width: 48vw;
    gap: 8px;
    border: 1px solid #1d3d68;
    background:
      radial-gradient(circle at 74% 18%, rgba(84, 166, 255, 0.24), transparent 25%),
      linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
    padding: 6px;
  }
  .header-profile-copy {
    max-width: calc(48vw - 64px);
  }
  .header-user-name,
  .header-user-email {
    max-width: 100%;
  }
  .header-profile-menu {
    top: calc(100% + 8px);
  }
  .header-avatar {
    width: 38px;
    height: 38px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .app-sidebar,
  .nav-item,
  .nav-icon,
  .sign-out,
  .sidebar-toggle,
  .flex-1.xl\:pl-80,
  .profile-sign-out,
  .logout-confirm-dialog,
  .logout-confirm-actions button {
    transition: none;
    animation: none;
  }
}
</style>
