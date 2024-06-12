<script lang="ts" setup>
import {ref, onMounted, onUnmounted, computed} from 'vue';
import { useWebAppHapticFeedback } from 'vue-tg'
import { useUserStore } from '@/store/user';
import {useAnimatedBalance} from "@/hooks/balance.ts";
import {useEnergy} from '@/hooks/energy';
import {formatNumber} from '@/hooks/format.ts';

const userStore = useUserStore()

const coinRef = ref<HTMLElement | null>(null);
const clickCount = ref(0);
let timerId: NodeJS.Timeout | undefined;

const resetClickCount = () => {
    console.log(`Кількість натискань: ${clickCount.value}`);
    userStore.sendMineCoins(clickCount.value)
    clickCount.value = 0; // Скидуємо лічильник після виведення
};
const onUserClick = () => {
    clickCount.value += 1;

    // Скидуємо таймер, якщо він вже був встановлений
    if (timerId) clearTimeout(timerId);

    // Встановлюємо новий таймер
    timerId = setTimeout(resetClickCount, 300); // Наприклад, чекаємо 1 секунду
};

onMounted(() => {
    // window.addEventListener('touchstart', onUserClick);
    // window.addEventListener('mousedown', onUserClick);
});

onUnmounted(() => {
    // window.removeEventListener('touchstart', onUserClick);
    // window.removeEventListener('mousedown', onUserClick);
    if (timerId) clearTimeout(timerId);
});

const numbersContainerRef = ref<HTMLElement | null>(null);
const isMobileDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};
const createFlyingNumber = (farm: number, x: number, y: number) => {
    const numberEl = document.createElement('div');
    numberEl.textContent = "+" + farm.toString(); // Тут може бути будь-яке число або текст
    numberEl.style.position = 'absolute';
    numberEl.style.left = `${x}px`;
    numberEl.style.top = `${y}px`;
    if (userStore.user && userStore.user.is_premium) {
        numberEl.style.color = '#ff9900';
    } else {
        numberEl.style.color = 'white';
    }
    numberEl.style.userSelect = 'none';
    numberEl.style.pointerEvents = 'none';
    numberEl.style.fontSize = '40px';
    numberEl.style.transform = 'translate(-50%, -50%)'; // Центрування відносно координат натискання
    numberEl.classList.add('flying-number');

    numbersContainerRef.value?.appendChild(numberEl);

    // Видаляємо елемент після анімації
    setTimeout(() => {
        numberEl.remove();
    }, 1000); // Тривалість анімації
};

function isTouchEvent(event: any): boolean {
  if ((window as any).TouchEvent !== undefined) {
    return event instanceof TouchEvent;
  }

  return event.touches !== undefined;
}
const applyTilt = (event: MouseEvent | TouchEvent) => {
    if (!userStore.user) return;
    if (!coinRef.value) return;

    if (event.type === 'mousedown' && isMobileDevice()) {
        return;
    }

    let clientX, clientY;

    if (isTouchEvent(event)) {
        const touchEvent = event as TouchEvent;
        clientX = touchEvent.touches[0].clientX;
        clientY = touchEvent.touches[0].clientY;
    } else {
        const mouseEvent = event as MouseEvent;
        clientX = mouseEvent.clientX;
        clientY = mouseEvent.clientY;
    }

    const numbersContainerRect = numbersContainerRef.value?.getBoundingClientRect();
    const relativeX = clientX - (numbersContainerRect?.left ?? 0);
    const relativeY = clientY - (numbersContainerRect?.top ?? 0);


    if (userStore.user.energy > userStore.user.mine_level) {
        userStore.mineCoins();
        var mul = 1
        if (userStore.user.is_premium) {
            mul = 2
        }
        createFlyingNumber(userStore.user.mine_level*mul, relativeX, relativeY);
        useWebAppHapticFeedback().impactOccurred("light");
        onUserClick()
    }

  coinRef.value.style.transform = 'translate(-50%, -50%) scale(0.98)';
};

const resetTilt = () => {
    if (coinRef.value) {
        coinRef.value.style.transform = '';
      coinRef.value.style.transform = 'translate(-50%, -50%) scale(1)';
    }
};

const animatedBalance = useAnimatedBalance()
const energy = useEnergy()
const formatedAnimatedBalance = computed(() => {
  return animatedBalance.value.toLocaleString();
});

const fe = computed(() => {
  return {
    energy: formatNumber(energy.energy.value),
    maxEnergy: formatNumber(energy.maxEnergy.value),
  };
});

</script>

<template>
  <main>
    <section class="hero-section" ref="numbersContainerRef">
<!--      <a href="#" class="join-team-link">-->
<!--        <span>Join team</span>-->
<!--        <img src="@/assets/arrow-right-circle.svg" width="32" height="32" alt="Arrow right">-->
<!--      </a>-->
      <div class="hero-offer">
        <span class="hero-offer__grade">Your balance</span>
        <h1 class="hero-offer__title">
          {{ formatedAnimatedBalance }}
        </h1>
      </div>
      <div class="coin">
        <img
            ref="coinRef"
            @mousedown="applyTilt" @touchstart="applyTilt"
            @mouseup="resetTilt" @mouseleave="resetTilt" @touchend="resetTilt"
            src="@/assets/coin.svg" class="coin__img" draggable="false" alt="">
      </div>
      <div class="progress">
        <div class="progress__info flex-center">
          <img src="@/assets/lightning.svg" width="24" height="24" alt="Lightning icon">
          <div class="progress__info-wrap bold">
            <span class="progress__current">{{fe.energy }}</span> / <span>{{ fe.maxEnergy }}</span>
          </div>
        </div>
        <div class="progress__bar-wrapper">
          <div class="progress__bar">
            <div class="progress__bar-inner" :style="`width: ${energy.energyPct.value}%;`"></div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
.flying-number {
  position: absolute;
  animation: flyAndFade 1s ease-out forwards;
  color: white;
  font-size: 48px;
  font-weight: bold;
  user-select: none; /* Додаємо цю властивість */
  pointer-events: none; /* Це запобігає взаємодії з елементом через курсор */
}

@keyframes flyAndFade {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-130px);
  }
}
</style>