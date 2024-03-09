<template>
    <div class="bottom-menu">
        <div class="energy">
            <span class="energy-icon">⚡️</span>
            <div class="energy-info">
              <span class="energy-value">{{ userStore.user?.energy }}</span>
              <span class="max-energy">/ {{ 1000 + (userStore.user?.max_energy_level ?? 0) * 500 }}</span>
            </div>
        </div>
        <div class="menu-items">
            <router-link class="menu-item" to="/leaderboard" tag="button">
                🏆
                <span>Top</span>
            </router-link>
            <router-link class="menu-item" to="/channels" tag="button">
                💰
                <span>Earn</span>
            </router-link>
            <router-link class="menu-item" to="/boosts" tag="button">
                🚀
                <span>Boosts</span>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user';

const userStore = useUserStore()
</script>

<style scoped>
.bottom-menu {
    overflow: hidden !important;
    -webkit-overflow-scrolling: touch;
    touch-action: none;

    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(128, 128, 128, 0.1);
    border-radius: 15px;
    padding: 10px 20px;
    margin: 20px;
    padding: 5px;
    margin: 5px;
}

.max-energy {
    color: gray; /* Сірий колір */
    font-size: 0.8em; /* Менший розмір шрифту */
    display: block; /* Робимо елемент блочним, щоб він відображався на новому рядку */
}

.energy {
    display: flex;
    align-items: center; /* Вирівнювання дочірніх елементів по вертикалі */
    /* Інші стилі залишаються без змін */
}

.energy-icon {
}

.energy-info {
    display: flex;
    flex-direction: column; /* Тексти відображаються один під одним */
}

.energy-value {
    font-weight: bold;
    font-size: 22px;
    margin-left: 5px;
}

.menu-items {
    display: flex;
}

.menu-item {
    display: flex;
    /* Встановлюємо flex-режим для кнопок */
    flex-direction: column;
    /* Розміщуємо іконки та текст вертикально */
    align-items: center;
    /* Вирівнюємо іконки та текст по центру */
    justify-content: center;
    /* Забезпечуємо рівномірне розподілення простору навколо вмісту */
    background: none;
    border: none;
    margin: 0 5px;
    padding: 10px 5px;
    border-radius: 5px;
    font-weight: bold;
    color: white;
    /* color: #333; */
    font-size: 1em;
    cursor: pointer;
    /* Робимо вказівник миші у формі пальця при наведенні */
    text-decoration: none;
    /* Видаляємо підкреслення тексту */
    outline: none;
    /* Видаляємо фокус-обрис для доступності */
    /* color: rgb(181, 181, 181); */
}</style>