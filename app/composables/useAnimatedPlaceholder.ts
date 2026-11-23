export const useAnimatedPlaceholder = (
  phrases: string[],
  options: { typeSpeed?: number; pause?: number } = {},
) => {
  const typeSpeed = options.typeSpeed ?? 38;
  const pause = options.pause ?? 1800;
  const placeholder = ref(phrases[0] || "");
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let phraseIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const schedule = (callback: () => void, delay: number) => {
    timeout = setTimeout(callback, delay);
  };

  const animate = () => {
    if (!phrases.length) return;

    const current = phrases[phraseIndex];
    if (!deleting) {
      characterIndex += 1;
      placeholder.value = `${current.slice(0, characterIndex)}|`;

      if (characterIndex >= current.length) {
        deleting = true;
        schedule(animate, pause);
        return;
      }

      schedule(animate, typeSpeed);
      return;
    }

    characterIndex -= 1;
    placeholder.value =
      characterIndex > 0 ? `${current.slice(0, characterIndex)}|` : "|";

    if (characterIndex <= 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      schedule(animate, 280);
      return;
    }

    schedule(animate, Math.max(18, typeSpeed / 2));
  };

  onMounted(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      placeholder.value = phrases[0] || "";
      return;
    }

    characterIndex = 0;
    deleting = false;
    placeholder.value = "|";
    schedule(animate, 450);
  });

  onBeforeUnmount(() => {
    if (timeout) clearTimeout(timeout);
  });

  return placeholder;
};
