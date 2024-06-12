import {ref, watch} from "vue";
import {useUserStore} from "@/store/user.ts";

export const useAnimatedBalance = () => {
  const userStore = useUserStore();
  const animatedBalance = ref(userStore.user?.balance || 0);

  // Функція для плавної зміни балансу
  function animateBalance(newBalance: number) {
    const startBalance = animatedBalance.value;
    const change = newBalance - startBalance;
    let duration = 900; // тривалість анімації в мілісекундах
    if (change <= 10) {
      duration = 300;
    }
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      animatedBalance.value = Math.round(startBalance + change * progress);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Спостерігаємо за зміною балансу і анімуємо цифри
  watch(() => userStore.user?.balance ?? 0, (newBalance: number) => {
    animateBalance(newBalance);
  }, { immediate: true });

  return animatedBalance;
}