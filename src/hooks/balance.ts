import { ref, watch } from "vue";
import { useUserStore } from "@/store/user.ts";

export const useAnimatedBalance = () => {
  const userStore = useUserStore();
  const animatedBalance = ref((userStore.user?.balance || 0) / 100);

  // Function to smoothly animate the balance change
  function animateBalance(newBalance: number) {
    const startBalance = animatedBalance.value;
    const change = newBalance - startBalance;
    let duration = 900; // animation duration in milliseconds
    if (change <= 0.1) {
      duration = 300;
    }
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      animatedBalance.value = Math.round((startBalance + change * progress) * 100) / 100;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Watch for balance changes and animate the numbers
  watch(
    () => (userStore.user?.balance ?? 0) / 100,
    (newBalance: number) => {
      animateBalance(newBalance);
    },
    { immediate: true }
  );

  return animatedBalance;
};
