<template>
  <div
    class="medivoy-auth-background grid min-h-[100dvh] w-full grid-cols-1 lg:grid-cols-2"
    @click="closeAccountTypeMenu"
  >
    <!-- Left panel -->
    <div
      class="brand-panel relative hidden min-h-[100dvh] flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-900 via-teal-800 to-sky-900 p-8 text-white sm:p-12 lg:flex"
    >
      <div class="health-visual" aria-hidden="true">
        <div class="health-orbit health-orbit--horizontal"></div>
        <div class="health-orbit health-orbit--vertical"></div>
        <div class="health-core">
          <span class="health-core__mark"></span>
        </div>
      </div>
      <div class="health-signal" aria-hidden="true">
        <span class="health-signal__trace"></span>
      </div>

      <div class="brand-logo-loop relative z-10">
        <img
          src="~/assets/images/medivoy-login-logo.png"
          alt="Medivoy"
          class="brand-motion brand-motion--logo h-auto w-48"
          fetchpriority="high"
        />
      </div>

      <div class="brand-content-loop relative z-10 max-w-xl space-y-10">
        <div class="space-y-5">
          <p
            class="brand-motion brand-motion--eyebrow text-xs font-semibold tracking-widest text-cyan-200 uppercase"
          >
            Preventive health, made personal
          </p>
          <h1 class="brand-motion brand-motion--headline text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            A clearer picture of your health.
          </h1>
          <p class="brand-motion brand-motion--description max-w-md text-base leading-7 text-slate-300">
            Bring your reports, family history, and wellness insights together
            to make more informed decisions about what comes next.
          </p>
        </div>

        <div class="max-w-lg divide-y divide-white/10 border-y border-white/10">
          <div class="brand-feature brand-feature--one brand-motion brand-motion--feature-one flex items-center justify-between gap-6 py-4">
            <p class="font-medium text-white">Health reports</p>
            <p class="text-right text-sm text-cyan-100/80">Your results, organized</p>
          </div>
          <div class="brand-feature brand-feature--two brand-motion brand-motion--feature-two flex items-center justify-between gap-6 py-4">
            <p class="font-medium text-white">Family history</p>
            <p class="text-right text-sm text-cyan-100/80">Patterns in context</p>
          </div>
          <div class="brand-feature brand-feature--three brand-motion brand-motion--feature-three flex items-center justify-between gap-6 py-4">
            <p class="font-medium text-white">Personal insights</p>
            <p class="text-right text-sm text-cyan-100/80">Genetics and nutrition</p>
          </div>
        </div>
      </div>

      <p class="brand-footer-loop relative z-10 text-xs text-cyan-100/80">
        © 2026 Medivoy. Not a medical diagnostic tool.
      </p>
    </div>

    <!-- Right panel -->
    <div
      class="auth-panel flex min-h-[100dvh] w-full flex-col items-center justify-center bg-transparent px-5 py-8 sm:px-10 sm:py-12"
    >
      <div
        class="auth-card flex w-full max-w-md flex-col gap-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.38)] sm:p-8"
      >
        <!-- Mobile logo -->
        <div class="flex items-center lg:hidden">
          <div class="w-fit rounded-lg bg-cyan-900 px-3 py-2">
            <img
              src="~/assets/images/medivoy-login-logo.png"
              alt="Medivoy"
              class="brand-motion brand-motion--logo h-auto w-40"
            />
          </div>
        </div>

        <div class="auth-item auth-item--intro">
          <header class="space-y-2">
            <p class="text-sm font-semibold text-blue-700">Welcome to Medivoy</p>
            <h2 class="medivoy-title-underline text-3xl font-semibold tracking-tight text-slate-950">
              Sign in to continue
            </h2>
            <p class="text-sm leading-6 text-slate-600">
              Continue with Google to access or create your health profile. No
              passwords to remember.
            </p>
          </header>
        </div>

        <div class="auth-item auth-item--action flex flex-col items-center gap-4">
          <div
            v-if="loading"
            class="flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-600"
          >
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-700" aria-hidden="true"></span>
            Signing you in...
          </div>
          <div v-show="!loading" id="google-signin-button"></div>
          <p
            v-if="message"
            role="alert"
            class="auth-message w-full rounded-xl px-4 py-3 text-center text-sm font-medium"
            :class="
              error
                ? 'bg-rose-50 text-rose-700'
                : 'bg-emerald-50 text-emerald-700'
            "
          >
            {{ message }}
          </p>
        </div>

        <p class="auth-security text-center text-xs leading-5 text-slate-500">
          Protected by 256-bit encryption · HIPAA-aligned privacy practices
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const pageTitle = "AI Medical & Genetic Report Analysis";
const pageDescription =
  "Upload your medical, lab, or genetic report and get instant AI-powered analysis. Track family health history and receive personalized nutrition and genetics guidance, all in one place.";

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: "Medivoy — AI Medical & Genetic Report Analysis",
  ogDescription: pageDescription,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Medivoy — AI Medical & Genetic Report Analysis",
  twitterDescription: pageDescription,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Medivoy",
        url: "https://geno.medivoy.in/",
        applicationCategory: "HealthApplication",
        operatingSystem: "Any",
        description: pageDescription,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        keywords:
          "medical report analysis, AI medical report analysis, health report analysis, genetic report analysis, DNA report analysis, blood test report analysis",
      }),
    },
  ],
});

const api = useMedivoyApi();
const auth = useAuthStore();
const router = useRouter();

const loading = ref(false);
const message = ref("");
const error = ref(false);

const setMsg = (msg: string, isError = false) => {
  message.value = msg;
  error.value = isError;
};

const handleGoogleCredential = async (response: { credential?: string }) => {
  if (!response.credential) return;
  loading.value = true;
  message.value = "";
  try {
    const res = await api.loginWithGoogle(response.credential);
    auth.login(res.user, res.access_token);
    await router.push("/dashboard");
  } catch {
    setMsg("We couldn't sign you in with Google. Please try again.", true);
    loading.value = false;
  }
};

let googleScript: HTMLScriptElement | null = null;

const initGoogleSignIn = () => {
  const clientId = useRuntimeConfig().public.googleClientId;
  const google = (window as any).google;
  if (!clientId || !google?.accounts?.id) return;

  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleGoogleCredential,
  });
  const target = document.getElementById("google-signin-button");
  if (target) {
    google.accounts.id.renderButton(target, {
      type: "standard",
      theme: "outline",
      size: "large",
      width: 320,
      text: "continue_with",
    });
  }
};

onMounted(() => {
  if ((window as any).google?.accounts?.id) {
    initGoogleSignIn();
    return;
  }

  googleScript = document.createElement("script");
  googleScript.src = "https://accounts.google.com/gsi/client";
  googleScript.async = true;
  googleScript.defer = true;
  googleScript.onload = initGoogleSignIn;
  document.head.appendChild(googleScript);
});
</script>

<style scoped>
.medivoy-auth-background {
  background:
    radial-gradient(
      ellipse at 88% 8%,
      rgb(14 116 144 / 0.08),
      transparent 36rem
    ),
    linear-gradient(145deg, #f1f7f9 0%, #f8fbfc 58%, #edf6f7 100%);
}

.auth-panel {
  background-image:
    radial-gradient(
      ellipse at 92% 8%,
      rgb(6 182 212 / 0.07),
      transparent 36%
    ),
    radial-gradient(
      ellipse at 8% 94%,
      rgb(37 99 235 / 0.045),
      transparent 32%
    );
}

.brand-panel::before {
  position: absolute;
  inset: -24%;
  z-index: 0;
  content: "";
  pointer-events: none;
  background:
    radial-gradient(
      ellipse at 22% 24%,
      rgb(59 130 246 / 0.16),
      transparent 46%
    ),
    radial-gradient(
      ellipse at 78% 78%,
      rgb(56 189 248 / 0.1),
      transparent 42%
    );
  opacity: 0.6;
  transform: translate3d(-2%, 1%, 0) scale(0.98);
  will-change: transform, opacity;
  animation: panel-atmosphere 18s ease-in-out infinite alternate;
}

.brand-logo-loop {
  animation: brand-float 7s ease-in-out 800ms infinite;
}

.brand-content-loop {
  animation: brand-float 9s ease-in-out 1.2s infinite reverse;
}

.brand-footer-loop {
  animation: footer-breathe 8s ease-in-out infinite;
}

.brand-feature {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.brand-feature::after {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    105deg,
    transparent 18%,
    rgb(147 197 253 / 0.08) 50%,
    transparent 82%
  );
  content: "";
  pointer-events: none;
  transform: translateX(-100%);
  animation: feature-sweep 8s ease-in-out infinite;
}

.brand-feature--two::after {
  animation-delay: 2.6s;
}

.brand-feature--three::after {
  animation-delay: 5.2s;
}

.brand-feature > p {
  position: relative;
  z-index: 1;
}

.health-visual {
  position: absolute;
  inset: 0;
  z-index: 1;
  --orbit-center-x: 85%;
  --core-size: 6rem;
  pointer-events: none;
  opacity: 0.42;
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .health-visual {
    --orbit-center-x: 93%;
    --core-size: 4.5rem;
  }
}

.health-orbit {
  position: absolute;
  top: 50%;
  left: var(--orbit-center-x);
  width: 150%;
  height: 38%;
  border: 1px solid rgb(147 197 253 / 0.28);
  border-radius: 50%;
  transform-style: preserve-3d;
  will-change: transform;
}

.health-orbit::after {
  position: absolute;
  top: 50%;
  left: -5px;
  width: 10px;
  height: 10px;
  border: 2px solid rgb(15 23 42 / 0.9);
  border-radius: 50%;
  background: #7dd3fc;
  content: "";
}

.health-orbit--horizontal {
  transform: translate(-50%, -50%) rotateX(68deg);
  animation: orbit-horizontal 24s linear infinite;
}

.health-orbit--vertical {
  width: 54%;
  height: 86%;
  border-color: rgb(96 165 250 / 0.36);
  transform: translate(-50%, -50%) rotateY(68deg) rotateZ(32deg);
  animation: orbit-vertical 19s linear infinite reverse;
}

.health-orbit--vertical::after {
  background: #60a5fa;
}

.health-core {
  position: absolute;
  top: 50%;
  left: var(--orbit-center-x);
  display: grid;
  width: var(--core-size);
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgb(191 219 254 / 0.55);
  border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, #38bdf8, #1d4ed8 72%);
  box-shadow:
    inset 0 1px 5px rgb(255 255 255 / 0.3),
    0 12px 30px rgb(2 6 23 / 0.24);
  animation: core-pulse 4s ease-in-out infinite;
  will-change: transform;
  transform: translate(-50%, -50%);
}

.health-core::before {
  position: absolute;
  inset: -12px;
  border: 1px solid rgb(147 197 253 / 0.28);
  border-radius: 50%;
  content: "";
}

.health-core__mark {
  position: relative;
  width: 1.65rem;
  height: 1.65rem;
}

.health-core__mark::before,
.health-core__mark::after {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 2px;
  background: rgb(255 255 255 / 0.94);
  content: "";
  transform: translate(-50%, -50%);
}

.health-core__mark::before {
  width: 100%;
  height: 5px;
}

.health-core__mark::after {
  width: 5px;
  height: 100%;
}

.health-signal {
  position: absolute;
  top: 82%;
  left: 10%;
  z-index: 2;
  width: 80%;
  height: 2.25rem;
  overflow: hidden;
  opacity: 0.34;
  pointer-events: none;
}

.health-signal::before {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(96 165 250 / 0.32) 16%,
    rgb(125 211 252 / 0.46) 50%,
    rgb(96 165 250 / 0.32) 84%,
    transparent
  );
  content: "";
}

.health-signal__trace {
  position: absolute;
  top: 0;
  left: 0;
  width: 36%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(125 211 252 / 0.94) 48%,
    rgb(191 219 254 / 0.84) 52%,
    transparent
  );
  clip-path: polygon(
    0 47%,
    38% 47%,
    43% 40%,
    47% 60%,
    51% 8%,
    56% 92%,
    61% 47%,
    100% 47%,
    100% 53%,
    61% 53%,
    56% 100%,
    51% 20%,
    47% 68%,
    43% 54%,
    38% 53%,
    0 53%
  );
  animation: health-signal-pass 7s linear infinite;
  filter: drop-shadow(0 0 5px rgb(56 189 248 / 0.3));
  will-change: transform;
}

@media (max-height: 860px) {
  .auth-panel {
    padding-block: 1rem;
  }

  .auth-card {
    gap: 1rem;
    padding-block: 1rem;
  }
}

@media (max-height: 800px) {
  .health-signal {
    display: none;
  }
}

@keyframes panel-atmosphere {
  from {
    opacity: 0.42;
    transform: translate3d(-2%, 1%, 0) scale(0.98);
  }

  to {
    opacity: 0.74;
    transform: translate3d(2%, -1%, 0) scale(1.03);
  }
}

@keyframes brand-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}

@keyframes footer-breathe {
  0%,
  100% {
    opacity: 0.82;
  }

  50% {
    opacity: 1;
  }
}

@keyframes feature-sweep {
  0%,
  18% {
    transform: translateX(-100%);
  }

  48%,
  100% {
    transform: translateX(100%);
  }
}

@keyframes orbit-horizontal {
  from {
    transform: translate(-50%, -50%) rotateX(68deg) rotateZ(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotateX(68deg) rotateZ(360deg);
  }
}

@keyframes orbit-vertical {
  from {
    transform: translate(-50%, -50%) rotateY(68deg) rotateZ(32deg);
  }

  to {
    transform: translate(-50%, -50%) rotateY(68deg) rotateZ(392deg);
  }
}

@keyframes core-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.045);
  }
}

@keyframes health-signal-pass {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(300%);
  }
}

.auth-card {
  animation: card-arrive 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.auth-item,
.auth-security,
.auth-message {
  opacity: 0;
  animation: item-arrive 480ms cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay, 0ms) both;
}

.auth-item--intro {
  --delay: 90ms;
}

.auth-item--action {
  --delay: 220ms;
}

.auth-security {
  --delay: 700ms;
}

.auth-message {
  --delay: 0ms;
}

@keyframes card-arrive {
  from {
    filter: blur(8px);
    opacity: 0;
    transform: translateY(14px) scale(0.99);
  }

  to {
    filter: blur(0);
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes item-arrive {
  0% {
    filter: blur(4px);
    opacity: 0;
    transform: translateY(10px);
  }

  70% {
    filter: blur(0);
    opacity: 1;
    transform: translateY(-1px);
  }

  100% {
    filter: blur(0);
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-motion {
  opacity: 0;
  filter: blur(12px);
  transform: perspective(900px) rotateY(-65deg) translateY(14px);
  transform-origin: left center;
  animation: brand-reveal 780ms cubic-bezier(0.2, 0.8, 0.2, 1) var(--delay) both;
}

.brand-motion--logo {
  --delay: 40ms;
}

.brand-motion--eyebrow {
  --delay: 120ms;
}

.brand-motion--headline {
  --delay: 200ms;
}

.brand-motion--description {
  --delay: 360ms;
}

.brand-motion--feature-one {
  --delay: 520ms;
}

.brand-motion--feature-two {
  --delay: 620ms;
}

.brand-motion--feature-three {
  --delay: 720ms;
}

@keyframes brand-reveal {
  0% {
    opacity: 0;
    filter: blur(12px);
    transform: perspective(900px) rotateY(-65deg) translateY(14px);
  }

  65% {
    opacity: 1;
    filter: blur(1px);
    transform: perspective(900px) rotateY(5deg) translateY(-2px);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    transform: perspective(900px) rotateY(0) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand-panel::before,
  .brand-logo-loop,
  .brand-content-loop,
  .brand-footer-loop,
  .brand-feature::after {
    animation: none;
    transform: none;
    will-change: auto;
  }

  .brand-feature::after {
    display: none;
  }

  .brand-panel::before {
    opacity: 0.5;
  }

  .brand-footer-loop {
    opacity: 1;
  }

  .health-orbit,
  .health-core {
    animation: none;
    will-change: auto;
  }

  .health-signal__trace {
    animation: none;
    transform: translateX(100%);
    will-change: auto;
  }

  .health-orbit--horizontal {
    transform: rotateX(68deg);
  }

  .health-orbit--vertical {
    transform: rotateY(68deg) rotateZ(32deg);
  }

  .auth-card,
  .auth-item,
  .auth-security,
  .auth-message {
    animation: none;
    filter: none;
    opacity: 1;
    transform: none;
  }

  .brand-motion {
    animation: none;
    filter: none;
    opacity: 1;
    transform: none;
  }
}
</style>
