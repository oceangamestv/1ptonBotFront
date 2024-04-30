<template>
  <div class="energy-section">
    <div class="energy">
      <div class="energy-info">
        <span class="energy-value">🔋{{ userStore.user?.energy }}</span>
      </div>
      <div class="max-energy-info">
        <span class="max-energy">/ {{ 1000 + (userStore.user?.max_energy_level ?? 0) * 500 }}</span>
      </div>
    </div>
    <div class="energy-progress-bar">
      <div class="energy-progress" :style="{ width: (userStore.user?.energy ?? 0 / (1000 + (userStore.user?.max_energy_level ?? 0) * 500) * 100) + '%' }"></div>
    </div>
  </div>
  <div class="bottom-menu">
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
  display: flex;
  flex-direction: column;
  background-color: rgba(252, 252, 252, 0.1);
  border-radius: 15px;
  border: 1px solid #595959;
  padding: 5px;
  margin: 5px 5px 15px;
}

.energy-section {
  margin: 5px;
}

.energy {
  display: flex;
  flex-direction: row;
}

.energy-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}

.energy-value {
  font-weight: bold;
  font-size: 22px;
}

.max-energy-info {
  display: flex;
  justify-content: flex-end; /* Вирівнювання максимальної енергії праворуч */
  align-items: flex-end;
  width: 100%;
}

.max-energy {
  color: gray;
  font-size: 0.8em;
}

.energy-progress-bar {
  height: 10px;
  width: 100%;
  background-color: #2b0046;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 5px; /* Відступ від тексту до прогрес бару */
}

.energy-progress {
  height: 100%;
  background-color: #9a00f3;
  border-radius: 5px;
}

.menu-items {
  display: flex;
  justify-content: space-around;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 10px 5px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  font-size: 1em;
  cursor: pointer;
  text-decoration: none;
  outline: none;
}
</style>



