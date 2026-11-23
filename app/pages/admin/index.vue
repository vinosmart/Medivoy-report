<template>
  <div class="admin-dashboard">
    <section class="admin-intro">
      <div class="admin-intro-copy">
        <span class="admin-eyebrow">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 20 6v5c0 4.5-3.2 8-8 10-4.8-2-8-5.5-8-10V6l8-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          Administration
        </span>
        <h1>Platform overview</h1>
        <p>
          Monitor account activity, reports, orders, and genetics profiles from
          one clear operational view.
        </p>
      </div>
      <div class="admin-intro-aside">
        <span class="admin-aside-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
          </svg>
        </span>
        <span>Operational metrics</span>
        <strong>{{ stats.length }}</strong>
        <small>Live platform indicators</small>
      </div>
    </section>

    <section class="admin-stat-grid" aria-label="Platform metrics">
      <article
        v-for="stat in stats"
        :key="stat.label"
        class="admin-stat-card"
        :class="`stat-tone-${stat.tone}`"
      >
        <div class="stat-card-top">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-icon" aria-hidden="true">
            <svg v-if="stat.label === 'Users'" viewBox="0 0 24 24">
              <circle cx="9" cy="8" r="3" />
              <path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20M16 5.5a3 3 0 0 1 0 5.8M17 14h.5a3.5 3.5 0 0 1 3.5 3.5V20" />
            </svg>
            <svg v-else-if="stat.label === 'Orders'" viewBox="0 0 24 24">
              <path d="M6 3h12l2 4H4l2-4ZM4 7v13h16V7M9 11h6m-6 4h6" />
            </svg>
            <svg v-else-if="stat.label === 'Failed jobs'" viewBox="0 0 24 24">
              <path d="M12 3 2.8 19h18.4L12 3Z" />
              <path d="M12 9v4m0 3h.01" />
            </svg>
            <svg v-else-if="stat.label === 'Genetics profiles'" viewBox="0 0 24 24">
              <path d="M7 3c10 4 10 14 0 18M17 3C7 7 7 17 17 21M8 6h8M6.5 10h11M6.5 14h11M8 18h8" />
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5m-5 3h5" />
            </svg>
          </span>
        </div>
        <strong class="stat-value">{{ stat.value }}</strong>
        <span class="stat-help">{{ stat.help }}</span>
      </article>
    </section>

    <section class="admin-overview-grid">
      <article class="admin-panel recent-panel">
        <div class="admin-panel-heading">
          <div>
            <span class="admin-kicker">Activity</span>
            <h2>Recent reports</h2>
            <p>Latest analysis jobs and statuses</p>
          </div>
          <NuxtLink to="/reports" class="admin-view-link">
            View all
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </NuxtLink>
        </div>
        <div v-if="loading" class="admin-skeleton-list" aria-label="Loading reports">
          <div v-for="n in 4" :key="n" class="admin-skeleton"></div>
        </div>
        <div v-else-if="recentReports.length" class="recent-report-list">
          <article
            v-for="report in recentReports"
            :key="report.id"
            class="recent-report"
          >
            <span class="report-file-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5m-5 3h5" />
              </svg>
            </span>
            <div class="report-info">
              <div class="report-title-line">
                <p>{{ report.title }}</p>
                <span class="report-status" :class="statusClass(report.status)">
                  {{ report.status }}
                </span>
              </div>
              <span class="report-meta">
                {{ report.type?.toUpperCase() || "REPORT" }}
                <i></i>
                {{ report.userEmail || report.userId || "—" }}
              </span>
            </div>
            <div class="report-risk">
              <span>Risk score</span>
              <strong :class="riskClass(report.riskScore)">
                {{ report.riskScore ?? "—" }}
              </strong>
            </div>
          </article>
        </div>
        <div v-else class="admin-empty">
          <span class="admin-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5m-5 3h5" />
            </svg>
          </span>
          <p>No reports to display yet.</p>
        </div>
      </article>

      <article class="admin-panel top-users-panel">
        <div class="admin-panel-heading">
          <div>
            <span class="admin-kicker">Engagement</span>
            <h2>Top users</h2>
            <p>Users with the most reports</p>
          </div>
        </div>
        <div v-if="loading" class="admin-skeleton-list" aria-label="Loading users">
          <div v-for="n in 4" :key="n" class="admin-skeleton"></div>
        </div>
        <div v-else-if="topUsers.length" class="top-user-list">
          <article
            v-for="(user, index) in topUsers"
            :key="user.userId"
            class="top-user"
          >
            <span class="top-user-rank">{{ String(index + 1).padStart(2, "0") }}</span>
            <span class="top-user-avatar" aria-hidden="true">
              {{ (user.name || user.email || user.userId || "U").slice(0, 1).toUpperCase() }}
            </span>
            <div class="top-user-info">
              <strong>{{ user.name || user.email || user.userId }}</strong>
              <span>{{ user.email || "No email" }}</span>
            </div>
            <span class="user-report-count">{{ user.count }} reports</span>
          </article>
        </div>
        <div v-else class="admin-empty">
          <span class="admin-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="9" cy="8" r="3" />
              <path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20" />
            </svg>
          </span>
          <p>No user activity to rank yet.</p>
        </div>
      </article>
    </section>

    <section class="admin-detail-grid">
      <article class="admin-panel users-panel">
        <div class="admin-panel-heading users-panel-heading">
          <div>
            <span class="admin-kicker">Directory</span>
            <h2>All users</h2>
            <p>Accounts, report counts, and health profile activity</p>
          </div>
          <label class="user-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input v-model="userSearch" type="search" aria-label="Search users" :placeholder="userSearchPlaceholder" />
          </label>
        </div>
        <div class="user-table-wrap">
          <div class="user-table-scroll">
            <table class="user-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Reports</th>
                  <th>Family</th>
                  <th>Genetics</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.userId">
                  <td>
                    <strong>{{ user.name || user.email || user.userId }}</strong>
                    <span>{{ user.email || "No email" }}</span>
                  </td>
                  <td><span class="role-badge">{{ user.role || "patient" }}</span></td>
                  <td class="table-number">{{ user.reportCount }}</td>
                  <td class="table-number">{{ user.familyCount }}</td>
                  <td>
                    <span
                      class="genetics-badge"
                      :class="user.hasGenetics ? 'genetics-present' : 'genetics-absent'"
                    >
                      {{ user.hasGenetics ? "Available" : "—" }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!filteredUsers.length">
                  <td colspan="5" class="table-empty">
                    {{ userSearch ? "No users match your search." : "No user accounts to display." }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article class="admin-panel workflow-panel">
        <div class="admin-panel-heading">
          <div>
            <span class="admin-kicker">Operations</span>
            <h2>Lab &amp; workflow</h2>
            <p>Orders, reports, and processing status</p>
          </div>
        </div>
        <div class="workflow-metrics">
          <div class="workflow-metric">
            <span class="workflow-icon workflow-orders" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" />
                <path d="m4.5 7.3 7.5 4 7.5-4M12 11.5V21M8 5l8 4" />
              </svg>
            </span>
            <div>
              <span>Total orders</span>
              <strong>{{ stats.find((stat) => stat.label === "Orders")?.value }}</strong>
            </div>
          </div>
          <div class="workflow-metric">
            <span class="workflow-icon workflow-complete" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M6 3h8l4 4v14H6V3Zm8 0v5h5" />
                <path d="m9 15 2 2 4-4" />
              </svg>
            </span>
            <div>
              <span>Completed reports</span>
              <strong>{{ stats.find((stat) => stat.label === "Completed reports")?.value }}</strong>
            </div>
          </div>
          <div class="workflow-metric">
            <span class="workflow-icon workflow-failed" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v6m0 4h.01" />
              </svg>
            </span>
            <div>
              <span>Failed jobs</span>
              <strong>{{ stats.find((stat) => stat.label === "Failed jobs")?.value }}</strong>
            </div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
const api = useMedivoyApi();
const loading = ref(true);
const userSearch = ref("");
const users = ref<any[]>([]);
const reports = ref<any[]>([]);
const familyMembers = ref<any[]>([]);
const orders = ref<any[]>([]);
const genetics = ref<any[]>([]);
const userSearchPlaceholder = ref("");
let userSearchTypeTimer: ReturnType<typeof setTimeout> | null = null;

const startUserSearchTypewriter = () => {
  const phrase = "Search users";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    userSearchPlaceholder.value = phrase;
    return;
  }

  let characterIndex = 0;
  const tick = () => {
    characterIndex++;
    userSearchPlaceholder.value = phrase.slice(0, characterIndex);
    if (characterIndex < phrase.length) {
      userSearchTypeTimer = setTimeout(tick, 55);
    }
  };
  tick();
};

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
    tone: "rose",
    value: String(users.value.length),
    help: "Registered accounts",
  },
  {
    label: "Reports",
    tone: "blue",
    value: String(reports.value.length),
    help: "Uploaded reports",
  },
  {
    label: "Orders",
    tone: "amber",
    value: String(orders.value.length),
    help: "Kit orders placed",
  },
  {
    label: "Completed reports",
    tone: "green",
    value: String(
      reports.value.filter((r: any) => r.status === "completed").length,
    ),
    help: "AI analysis complete",
  },
  {
    label: "Failed jobs",
    tone: "rose",
    value: String(
      reports.value.filter((r: any) => r.status === "failed").length,
    ),
    help: "Processing errors",
  },
  {
    label: "Genetics profiles",
    tone: "purple",
    value: String(genetics.value.length),
    help: "Saved DNA analyses",
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

onBeforeUnmount(() => {
  if (userSearchTypeTimer) clearTimeout(userSearchTypeTimer);
});

onMounted(async () => {
  startUserSearchTypewriter();
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

<style scoped>
.admin-dashboard {
  display: grid;
  gap: 20px;
  color: #233b59;
  font-family: Poppins, system-ui, sans-serif;
}
.admin-intro {
  position: relative;
  display: flex;
  min-height: 205px;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  overflow: hidden;
  border: 1px solid #e1ebf7;
  border-radius: 22px;
  background: linear-gradient(112deg, #fff 0%, #fff 58%, #f0f6ff 100%);
  padding: 28px 32px;
  box-shadow: 0 12px 32px rgba(37, 75, 120, 0.045);
}
.admin-intro::after {
  position: absolute;
  top: -135px;
  right: 145px;
  width: 290px;
  height: 290px;
  border: 1px solid rgba(95, 151, 218, 0.1);
  border-radius: 50%;
  box-shadow: 0 0 0 30px rgba(95, 151, 218, 0.035), 0 0 0 62px rgba(95, 151, 218, 0.025);
  content: "";
  pointer-events: none;
}
.admin-intro-copy {
  position: relative;
  z-index: 1;
  max-width: 700px;
}
.admin-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #274568;
  border-radius: 999px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 7px 11px;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.admin-eyebrow svg,
.admin-aside-icon svg,
.stat-icon svg,
.report-file-icon svg,
.admin-empty-icon svg,
.orders-icon svg,
.workflow-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.admin-intro h1 {
  margin: 15px 0 0;
  color: #0b1c39;
  font-size: clamp(28px, 3vw, 36px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04em;
}
.admin-intro-copy > p {
  max-width: 650px;
  margin: 10px 0 0;
  color: #7489a3;
  font-size: 14px;
  line-height: 1.7;
}
.admin-intro-aside {
  position: relative;
  z-index: 1;
  display: grid;
  width: 190px;
  flex: 0 0 auto;
  justify-items: start;
  border: 1px solid rgba(151, 190, 235, 0.22);
  border-radius: 16px;
  background: linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  padding: 15px;
  box-shadow: 0 10px 24px rgba(11, 28, 57, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.admin-intro-aside:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(11, 28, 57, 0.21);
}
.admin-aside-icon,
.stat-icon,
.report-file-icon,
.admin-empty-icon,
.workflow-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
}
.admin-aside-icon {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(169, 210, 255, 0.26);
  border-radius: 11px;
  background: rgba(109, 176, 255, 0.14);
  color: #b7dcff;
}
.admin-intro-aside > span:nth-child(2) {
  margin-top: 9px;
  color: #a9d2ff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.admin-intro-aside strong {
  margin-top: 2px;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
}
.admin-intro-aside small {
  margin-top: 4px;
  color: #c1d4eb;
  font-size: 9px;
}
.admin-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
}
.admin-stat-card,
.admin-panel {
  min-width: 0;
  border: 1px solid #e4ecf5;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 26px rgba(33, 70, 112, 0.035);
}
.admin-stat-card {
  --stat-accent: #4a91f2;
  --stat-soft: rgba(74, 145, 242, 0.075);
  --stat-icon-bg: #edf5ff;
  --stat-hover-bg: #f7fbff;
  position: relative;
  overflow: hidden;
  border-top: 2px solid var(--stat-accent);
  border-radius: 22px;
  padding: 21px 23px 19px;
  transition: box-shadow 0.18s ease, transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
}
.admin-stat-card::after {
  position: absolute;
  right: -25px;
  bottom: -48px;
  width: 124px;
  height: 124px;
  border-radius: 50%;
  background: var(--stat-soft);
  content: "";
  pointer-events: none;
}
.stat-tone-rose {
  --stat-accent: #fb5e7a;
  --stat-soft: rgba(251, 94, 122, 0.075);
  --stat-icon-bg: #fff0f3;
  --stat-hover-bg: #fff8fa;
}
.stat-tone-blue {
  --stat-accent: #438dff;
  --stat-soft: rgba(67, 141, 255, 0.075);
  --stat-icon-bg: #edf5ff;
  --stat-hover-bg: #f7fbff;
}
.stat-tone-amber {
  --stat-accent: #f59b17;
  --stat-soft: rgba(245, 155, 23, 0.08);
  --stat-icon-bg: #fff4e5;
  --stat-hover-bg: #fffaf2;
}
.stat-tone-green {
  --stat-accent: #43a77b;
  --stat-soft: rgba(67, 167, 123, 0.075);
  --stat-icon-bg: #edf8f3;
  --stat-hover-bg: #f7fcf9;
}
.stat-tone-purple {
  --stat-accent: #9272e8;
  --stat-soft: rgba(146, 114, 232, 0.08);
  --stat-icon-bg: #f3efff;
  --stat-hover-bg: #faf8ff;
}
.admin-stat-card:hover,
.admin-stat-card:active {
  border-color: var(--stat-accent);
  background: var(--stat-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(42, 82, 132, 0.09);
}
.stat-icon {
  transition: transform 0.2s ease, background-color 0.18s ease, color 0.18s ease;
}
.admin-stat-card:hover .stat-icon,
.admin-stat-card:active .stat-icon {
  transform: translateY(-2px);
  background: var(--stat-accent);
  color: #fff;
}
.stat-card-top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.stat-icon {
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 15px;
  background: var(--stat-icon-bg);
  color: var(--stat-accent);
}
.stat-icon svg {
  width: 17px;
  height: 17px;
}
.stat-label {
  color: #7188a4;
  font-size: 13px;
  font-weight: 600;
}
.stat-value {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 11px;
  color: #233e5d;
  font-size: 38px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.035em;
}
.stat-help {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 5px;
  color: var(--stat-accent);
  font-size: 11px;
  font-weight: 600;
}
.admin-overview-grid,
.admin-detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 1fr);
  gap: 18px;
  align-items: start;
}
.admin-panel {
  border-color: #e1eaf4;
  border-radius: 20px;
  padding: 23px;
  box-shadow: 0 10px 28px rgba(33, 70, 112, 0.045);
}
.top-users-panel {
  padding-bottom: 14px;
}
.admin-panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.admin-kicker {
  display: block;
  margin-bottom: 6px;
  color: #7188a4;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.admin-panel-heading h2 {
  margin: 0;
  color: #203b5b;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.admin-panel-heading p {
  margin: 5px 0 0;
  color: #7187a2;
  font-size: 12px;
  line-height: 1.5;
}
.admin-view-link {
  display: inline-flex;
  flex: 0 0 auto;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #d6e5f6;
  border-radius: 11px;
  background: #fff;
  padding: 0 13px;
  color: #3478cc;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(37, 87, 145, 0.035);
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.18s ease;
}
.admin-view-link:hover {
  border-color: #a9cff8;
  background: #f3f8ff;
  color: #286bc0;
  box-shadow: 0 5px 12px rgba(37, 87, 145, 0.06);
}
.admin-view-link svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.18s ease;
}
.admin-view-link:hover svg {
  transform: translateX(2px);
}
.admin-skeleton-list,
.recent-report-list,
.top-user-list,
.workflow-metrics {
  display: grid;
  gap: 9px;
}
.admin-skeleton {
  min-height: 68px;
  border: 1px solid #e3ebf5;
  border-radius: 14px;
  background: linear-gradient(100deg, #f6f8fb 30%, #edf2f8 50%, #f6f8fb 70%);
  background-size: 200% 100%;
  animation: admin-shimmer 1.5s ease-in-out infinite;
}
.recent-report {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
  border: 1px solid #e3ebf5;
  border-radius: 14px;
  background: #fff;
  padding: 13px 14px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.recent-report:hover {
  border-color: #d7e5f4;
  box-shadow: 0 4px 12px rgba(42, 82, 132, 0.045);
}
.report-file-icon {
  width: 36px;
  height: 36px;
  border: 1px solid #e0eaf5;
  border-radius: 11px;
  background: #f6f9fd;
  color: #6d8daf;
}
.report-info {
  min-width: 0;
  flex: 1;
}
.report-title-line {
  display: flex;
  min-width: 0;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
}
.report-title-line p {
  overflow: hidden;
  max-width: 100%;
  margin: 0;
  color: #304a69;
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.report-status {
  flex: 0 0 auto;
  border: 1px solid rgba(110, 142, 177, 0.12);
  border-radius: 999px;
  padding: 4px 7px;
  font-size: 8px;
  font-weight: 700;
  text-transform: capitalize;
}
.report-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  margin-top: 5px;
  color: #8296ae;
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.report-meta i {
  width: 3px;
  height: 3px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #a7b6c8;
}
.report-risk {
  display: grid;
  flex: 0 0 auto;
  justify-items: end;
}
.report-risk span {
  color: #93a2b5;
  font-size: 8px;
}
.report-risk strong {
  margin-top: 2px;
  font-size: 15px;
  font-weight: 700;
}
.top-user {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 9px;
  border-bottom: 1px solid #edf2f7;
  padding: 8px 0;
}
.top-user:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
.top-user-rank {
  color: #99aabd;
  font-size: 9px;
  font-weight: 700;
}
.top-user-avatar {
  display: grid;
  width: 35px;
  height: 35px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #dceafb;
  border-radius: 11px;
  background: #eff6ff;
  color: #397cc1;
  font-size: 11px;
  font-weight: 700;
}
.top-user-info {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 3px;
}
.top-user-info strong,
.top-user-info > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.top-user-info strong {
  color: #304a69;
  font-size: 10px;
  font-weight: 700;
}
.top-user-info > span {
  color: #8498b1;
  font-size: 9px;
}
.user-report-count {
  flex: 0 0 auto;
  border: 1px solid #dfeafb;
  border-radius: 999px;
  background: #f3f8ff;
  padding: 5px 8px;
  color: #527ba6;
  font-size: 8px;
  font-weight: 700;
}
.admin-empty {
  display: grid;
  min-height: 154px;
  align-content: center;
  justify-items: center;
  border: 1px solid #e5edf7;
  border-radius: 15px;
  background: linear-gradient(145deg, #fbfdff, #f7faff);
  padding: 20px;
  text-align: center;
}
.admin-empty-icon {
  width: 40px;
  height: 40px;
  border: 1px solid #274568;
  border-radius: 13px;
  background:
    radial-gradient(circle at 88% 12%, rgba(84, 166, 255, 0.2), transparent 28%),
    linear-gradient(145deg, #0b1c39 0%, #102b53 58%, #153766 100%);
  color: #fff;
}
.admin-empty p {
  margin: 10px 0 0;
  color: #6f839d;
  font-size: 12px;
  font-weight: 500;
}
.users-panel {
  grid-column: span 1;
}
.users-panel-heading {
  align-items: flex-end;
}
.user-search {
  display: flex;
  width: min(250px, 42%);
  min-height: 40px;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  border: 1px solid #dfe8f2;
  border-radius: 11px;
  background: #f9fbfe;
  padding: 0 11px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.user-search:focus-within {
  border-color: #82b4e8;
  box-shadow: none;
}
.user-search svg {
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
  fill: none;
  stroke: #8ca0b8;
  stroke-width: 1.8;
  stroke-linecap: round;
}
.user-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color: #304a69;
  font-family: inherit;
  font-size: 12px;
  outline: none;
  box-shadow: none;
}
.user-search input::placeholder {
  color: #98a9bd;
}
.user-table-wrap {
  overflow: hidden;
  border: 1px solid #e2eaf4;
  border-radius: 15px;
}
.user-table-scroll {
  max-height: 480px;
  overflow: auto;
}
.user-table {
  width: 100%;
  min-width: 580px;
  border-collapse: separate;
  border-spacing: 0;
  font-family: Poppins, system-ui, sans-serif;
  font-size: 12px;
  text-align: left;
}
.user-table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f4f8fd;
}
.user-table th {
  border-bottom: 1px solid #e3ebf5;
  padding: 12px 13px;
  color: #6f849e;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.user-table td {
  border-bottom: 1px solid #edf2f7;
  padding: 12px 13px;
  color: #49627f;
}
.user-table tbody tr:last-child td {
  border-bottom: 0;
}
.user-table tbody tr:hover {
  background: #f9fbfe;
}
.user-table td:first-child {
  min-width: 180px;
}
.user-table td:first-child strong,
.user-table td:first-child span {
  display: block;
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-table td:first-child strong {
  color: #294464;
  font-size: 12px;
  font-weight: 700;
}
.user-table td:first-child span {
  margin-top: 3px;
  color: #8498b1;
  font-size: 10px;
}
.role-badge,
.genetics-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid #e2eaf4;
  border-radius: 999px;
  background: #f6f8fb;
  padding: 4px 8px;
  color: #687f99;
  font-size: 9px;
  font-weight: 700;
  text-transform: capitalize;
}
.table-number {
  color: #304a69 !important;
  font-weight: 700;
}
.genetics-present {
  border-color: #d9eee4;
  background: #f3fbf7;
  color: #4f8a6a;
}
.genetics-absent {
  color: #8b9db1;
}
.user-table .table-empty {
  padding: 36px 16px;
  color: #70849e;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}
.workflow-panel {
  align-self: stretch;
}
.workflow-metrics {
  gap: 10px;
}
.workflow-metric {
  display: flex;
  align-items: center;
  gap: 13px;
  border: 1px solid #e3ebf5;
  border-radius: 14px;
  background: #fbfdff;
  padding: 14px;
}
.workflow-icon {
  width: 36px;
  height: 36px;
  border: 1px solid #dfeafb;
  border-radius: 11px;
  background: #f1f7ff;
  color: #5289c2;
}
.workflow-icon svg {
  width: 17px;
  height: 17px;
}
.workflow-complete {
  border-color: #dceee4;
  background: #f1faf5;
  color: #579875;
}
.workflow-failed {
  border-color: #f0e2d9;
  background: #fff8f4;
  color: #bd8065;
}
.workflow-metric > div {
  display: grid;
  gap: 4px;
}
.workflow-metric > div > span {
  color: #70859f;
  font-family: Poppins, system-ui, sans-serif;
  font-size: 12px;
}
.workflow-metric strong {
  color: #304a69;
  font-family: Poppins, system-ui, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}
@keyframes admin-shimmer {
  to {
    background-position: -200% 0;
  }
}
@keyframes admin-enter {
  from {
    opacity: 0;
    translate: 0 9px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
.admin-intro,
.admin-stat-card,
.admin-panel {
  animation: admin-enter 480ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.admin-stat-card:nth-child(1) { animation-delay: 60ms; }
.admin-stat-card:nth-child(2) { animation-delay: 110ms; }
.admin-stat-card:nth-child(3) { animation-delay: 160ms; }
.admin-stat-card:nth-child(4) { animation-delay: 210ms; }
.admin-stat-card:nth-child(5) { animation-delay: 260ms; }
.admin-stat-card:nth-child(6) { animation-delay: 310ms; }
.recent-panel,
.top-users-panel {
  animation-delay: 360ms;
}
.users-panel,
.workflow-panel {
  animation-delay: 430ms;
}
.recent-report,
.top-user,
.workflow-metric,
.admin-empty {
  animation: admin-enter 360ms cubic-bezier(0.22, 0.68, 0, 1) both;
}
.recent-report:nth-child(1),
.top-user:nth-child(1),
.workflow-metric:nth-child(1) { animation-delay: 420ms; }
.recent-report:nth-child(2),
.top-user:nth-child(2),
.workflow-metric:nth-child(2) { animation-delay: 470ms; }
.recent-report:nth-child(3),
.top-user:nth-child(3),
.workflow-metric:nth-child(3) { animation-delay: 520ms; }
.recent-report:nth-child(4),
.top-user:nth-child(4) { animation-delay: 570ms; }
.admin-empty { animation-delay: 420ms; }
@media (max-width: 1100px) {
  .admin-stat-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .admin-overview-grid,
  .admin-detail-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .admin-intro {
    align-items: flex-start;
    padding: 23px;
  }
  .admin-intro-aside {
    width: 165px;
  }
  .admin-stat-grid {
    gap: 10px;
  }
  .admin-stat-card {
    padding: 16px;
  }
  .stat-value {
    font-size: 32px;
  }
  .admin-panel {
    padding: 17px;
  }
  .users-panel-heading {
    align-items: stretch;
    flex-direction: column;
  }
  .user-search {
    width: 100%;
  }
}
@media (max-width: 540px) {
  .admin-dashboard {
    gap: 15px;
  }
  .admin-intro {
    min-height: 0;
    flex-direction: column;
    gap: 17px;
    border-radius: 18px;
    padding: 20px;
  }
  .admin-intro::after {
    top: -130px;
    right: -130px;
  }
  .admin-intro h1 {
    font-size: 27px;
  }
  .admin-intro-copy > p {
    font-size: 12px;
  }
  .admin-intro-aside {
    width: 100%;
    grid-template-columns: 36px 1fr;
    column-gap: 10px;
    padding: 11px 13px;
  }
  .admin-aside-icon {
    grid-row: span 3;
  }
  .admin-intro-aside > span:nth-child(2),
  .admin-intro-aside strong,
  .admin-intro-aside small {
    margin-top: 0;
  }
  .admin-stat-grid {
    grid-template-columns: 1fr 1fr;
  }
  .admin-stat-card {
    padding: 13px;
  }
  .stat-icon {
    width: 34px;
    height: 34px;
    border-radius: 12px;
  }
  .stat-label {
    font-size: 11px;
  }
  .stat-value {
    margin-top: 11px;
    font-size: 26px;
  }
  .stat-help {
    font-size: 10px;
    line-height: 1.4;
  }
  .admin-panel-heading {
    align-items: flex-start;
  }
  .recent-report {
    flex-wrap: wrap;
  }
  .report-risk {
    margin-left: 47px;
  }
  .top-user {
    gap: 7px;
  }
  .user-report-count {
    padding: 4px 6px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .admin-stat-card,
  .recent-report,
  .admin-view-link,
  .admin-view-link svg,
  .admin-intro-aside,
  .stat-icon {
    transition: none;
  }
  .admin-intro,
  .admin-stat-card,
  .admin-panel,
  .recent-report,
  .top-user,
  .workflow-metric,
  .admin-empty {
    animation: none;
    translate: none;
  }
  .admin-intro-aside:hover,
  .admin-stat-card:hover,
  .admin-stat-card:hover .stat-icon,
  .admin-view-link:hover svg {
    transform: none;
  }
  .admin-skeleton {
    animation: none;
  }
}
</style>
