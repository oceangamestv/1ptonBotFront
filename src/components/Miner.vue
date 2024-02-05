<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Balance from './account/Balance.vue';
import { useWebAppHapticFeedback } from 'vue-tg'
import BottomMenu from './BottomMenu.vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore()

const coinRef = ref<HTMLElement | null>(null);
const clickCount = ref(0);
let timerId: number | undefined;

const resetClickCount = () => {
    console.log(`Кількість натискань: ${clickCount.value}`);
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
    window.addEventListener('touchstart', onUserClick);
    window.addEventListener('mousedown', onUserClick);
});

onUnmounted(() => {
    window.removeEventListener('touchstart', onUserClick);
    window.removeEventListener('mousedown', onUserClick);
    if (timerId) clearTimeout(timerId);
});

const numbersContainerRef = ref<HTMLElement | null>(null);
const isMobileDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};
const createFlyingNumber = (farm: number, x: number, y: number) => {
    const numberEl = document.createElement('div');
    numberEl.textContent = farm.toString(); // Тут може бути будь-яке число або текст
    numberEl.style.position = 'absolute';
    numberEl.style.left = `${x}px`;
    numberEl.style.top = `${y}px`;
    numberEl.style.color = 'white';
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

const applyTilt = (event: MouseEvent | TouchEvent) => {
    if (!coinRef.value) return;

    if (event.type === 'mousedown' && isMobileDevice()) {
        return;
    }

    let clientX, clientY;

    if (event instanceof TouchEvent) {
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


    if ((userStore.user?.energy ?? 0) > 0) {
        userStore.mineCoins();
        createFlyingNumber(userStore.user?.mine_level ?? 0, relativeX, relativeY);
        useWebAppHapticFeedback().impactOccurred("light");
    }

    const coinRect = coinRef.value.getBoundingClientRect();
    const coinCenterX = coinRect.left + coinRect.width / 2;
    const coinCenterY = coinRect.top + coinRect.height / 2;

    const tiltX = clientX < coinCenterX ? 'rotateY(-10deg)' : 'rotateY(10deg)';
    const tiltY = clientY < coinCenterY ? 'rotateX(10deg)' : 'rotateX(-10deg)';

    coinRef.value.style.transform = `${tiltY} ${tiltX}`;
};

const resetTilt = () => {
    if (coinRef.value) {
        coinRef.value.style.transform = '';
    }
};

</script>

<template>
    <main>
        <Balance />
        <div class="coin-container numbers-container" ref="numbersContainerRef">
            <img src="../assets/images/coin.png" class="coin" ref="coinRef" @mousedown="applyTilt" @touchstart="applyTilt"
                @mouseup="resetTilt" @mouseleave="resetTilt" @touchend="resetTilt" />
        </div>
    </main>
    <BottomMenu />
</template>

<style scoped>
.coin-container {
    position: relative;
    text-align: center;
}

.coin {
    transition: transform 0.2s;
    cursor: pointer;
    width: 80%;
    height: auto;
    user-select: none;
    /* Додаємо цю властивість */
}
</style>