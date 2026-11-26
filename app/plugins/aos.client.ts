import AOS from "aos";

const animationTargets = [
  "main .page-shell > * > *",
  "main .search-section",
  "main .results-grid",
  ".auth-card",
  ".brand-panel",
].join(",");

export default defineNuxtPlugin((nuxtApp) => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let initialized = false;
  let refreshFrame: number | undefined;

  const refreshAnimations = () => {
    if (reducedMotion.matches) return;

    const targets = document.querySelectorAll<HTMLElement>(animationTargets);
    targets.forEach((element, index) => {
      if (element.hasAttribute("data-aos")) return;

      element.dataset.aos = "fade-up";
      element.dataset.aosDuration = "280";
      element.dataset.aosDelay = String(Math.min(index * 24, 72));
    });

    if (!initialized) {
      AOS.init({
        duration: 280,
        easing: "ease-out-cubic",
        offset: 24,
        once: true,
        mirror: false,
        disable: () => reducedMotion.matches,
      });
      initialized = true;
      return;
    }

    AOS.refreshHard();
  };

  const scheduleRefresh = () => {
    if (refreshFrame !== undefined) cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = undefined;
      refreshAnimations();
    });
  };

  const contentObserver = new MutationObserver(scheduleRefresh);
  let observingContent = false;

  const startAnimations = () => {
    if (nuxtApp.isHydrating) return;

    scheduleRefresh();
    if (observingContent) return;

    const animationRoot =
      document.querySelector("#main-content") ?? document.body;
    contentObserver.observe(animationRoot, { childList: true, subtree: true });
    observingContent = true;
  };

  nuxtApp.hook("app:mounted", startAnimations);
  nuxtApp.hook("app:suspense:resolve", startAnimations);
  reducedMotion.addEventListener("change", scheduleRefresh);
});
