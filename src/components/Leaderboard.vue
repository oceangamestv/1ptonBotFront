<script lang="ts" setup>
import { useLeaderboardStore } from '@/store/leaderboard';
import { useUserStore } from '@/store/user';
import { onMounted, ref } from 'vue';


const leaderboardStore = useLeaderboardStore()
const userStore = useUserStore()
const user = userStore.user

onMounted(() => {
  leaderboardStore.fetchDailyLeaderboard()
  leaderboardStore.fetchMonthlyLeaderboard()
  leaderboardStore.fetchLeaderboard()
})

const activeTab = ref('Day');
// Функція для зміни вкладки
const setActiveTab = (tabName: string) => {
  activeTab.value = tabName;
  // Тут можна додати логіку для завантаження даних в залежності від вибраної вкладки
  // Наприклад: leaderboardStore.fetchLeaderboard(tabName);
};
</script>

<template>
  <div class="tabs">
    <button @click="setActiveTab('Day')" class="tab">Day</button>
    <button @click="setActiveTab('Month')" class="tab">Month</button>
    <button @click="setActiveTab('Balance')" class="tab">Balance</button>
  </div>
  <div class="leaderboard" v-if="activeTab === 'Day'">
    <div class="leaderboard-title">
      🏆 Top growth today
    </div>
    <div class="leaderboard-list">
      <div class="player you" v-if="leaderboardStore.dailyLeaderboard?.me != null">
        <span class="avatar">
          <img v-if="leaderboardStore.dailyLeaderboard?.me.avatar_url" :src="leaderboardStore.dailyLeaderboard?.me.avatar_url"
            :alt="leaderboardStore.dailyLeaderboard?.me.identity" />
          <div v-else class="initials">{{ leaderboardStore.dailyLeaderboard?.me?.identity?.substring(0, 2).toUpperCase() }}
          </div>
        </span>
        <div class="player-info">
          <span class="name">You on {{ leaderboardStore.dailyLeaderboard?.me?.position }} place</span>
          <span class="player-score">🪙 +{{ leaderboardStore.dailyLeaderboard?.me?.score.toLocaleString() }}</span>
        </div>
      </div>
      <div v-for="(player, index) in leaderboardStore.dailyLeaderboard?.players" :key="player.id" class="player">
        <span class="rank">{{ index + 1 }}.</span>
        <span class="avatar">
          <img v-if="player.avatar_url" :src="player.avatar_url" :alt="player.identity" />
          <div v-else class="initials">{{ player.identity.substring(0, 2).toUpperCase() }}</div>
        </span>
        <div class="player-info">
          <span v-if="player.is_premium" class="name">{{ player.identity }}</span>
          <span v-else>{{ player.identity }}</span>
          <span class="player-score">🪙 +{{ player.score.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="leaderboard" v-if="activeTab === 'Month'">
    <div class="leaderboard-title">
      🏆 Top growth this month
    </div>
    <div class="leaderboard-list">
      <div class="player you" v-if="leaderboardStore.monthlyLeaderboard?.me != null">
        <span class="avatar">
          <img v-if="leaderboardStore.monthlyLeaderboard?.me.avatar_url" :src="leaderboardStore.monthlyLeaderboard?.me.avatar_url"
            :alt="leaderboardStore.monthlyLeaderboard?.me.identity" />
          <div v-else class="initials">{{ leaderboardStore.monthlyLeaderboard?.me?.identity?.substring(0, 2).toUpperCase() }}
          </div>
        </span>
        <div class="player-info">
          <span class="name">You on {{ leaderboardStore.monthlyLeaderboard?.me?.position }} place</span>
          <span class="player-score">🪙 +{{ leaderboardStore.monthlyLeaderboard?.me?.score.toLocaleString() }}</span>
        </div>
      </div>
      <div v-for="(player, index) in leaderboardStore.monthlyLeaderboard?.players" :key="player.id" class="player">
        <span class="rank">{{ index + 1 }}.</span>
        <span class="avatar">
          <img v-if="player.avatar_url" :src="player.avatar_url" :alt="player.identity" />
          <div v-else class="initials">{{ player.identity.substring(0, 2).toUpperCase() }}</div>
        </span>
        <div class="player-info">
          <span v-if="player.is_premium" class="name">{{ player.identity }}</span>
          <span v-else>{{ player.identity }}</span>
          <span class="player-score">🪙 +{{ player.score.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="leaderboard" v-if="activeTab === 'Balance'">
    <div class="leaderboard-title">
      🏆 Top users by balance
    </div>
    <div class="leaderboard-list">
      <div class="player you" v-if="leaderboardStore.monthlyLeaderboard?.me != null">
        <span class="avatar">
          <img v-if="leaderboardStore.leaderboard?.me?.avatar_url" :src="leaderboardStore.leaderboard?.me.avatar_url"
            :alt="leaderboardStore.leaderboard?.me.identity" />
          <div v-else class="initials">{{ leaderboardStore.leaderboard?.me?.identity?.substring(0, 2).toUpperCase() }}
          </div>
        </span>
        <div class="player-info">
          <span class="name">You on {{ leaderboardStore.leaderboard?.me?.position }} place</span>
          <span class="player-score">🪙 {{ user?.balance.toLocaleString() }}</span>
        </div>
      </div>
      <div v-for="(player, index) in leaderboardStore.leaderboard?.players" :key="player.id" class="player">
        <span class="rank">{{ index + 1 }}.</span>
        <span class="avatar">
          <img v-if="player.avatar_url" :src="player.avatar_url" :alt="player.identity" />
          <div v-else class="initials">{{ player.identity.substring(0, 2).toUpperCase() }}</div>
        </span>
        <div class="player-info">
          <span v-if="player.is_premium" class="name">{{ player.identity }}</span>
          <span v-else>{{ player.identity }}</span>
          <span class="player-score">🪙 {{ player.score.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  margin: 10px;
}
.tabs button {
  background-color: rgba(57, 57, 57, 0.5); /* Білий колір з напівпрозорістю */
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: white;
}

.tabs button:hover {
  background-color: rgba(255, 255, 255, 0.7); /* Збільшуємо прозорість при наведенні */
}

.tabs button.active {
  background-color: rgba(112, 112, 112, 0.9); /* Активна кнопка буде менш прозорою */
}
.name {
  color: rgb(255, 153, 0);
}

.player {
  display: flex;
  align-items: center;

  margin: 10px;
  background: rgba(128, 128, 128, 0.1);
  color: #fff;
  padding: 10px;
  border-radius: 8px;
}

.you {
  background: rgba(255, 200, 0, 0.1);
}

.leaderboard-title {
  margin: 10px;
  font-size: 24px;
}

.player-info {
  display: flex;
  flex-direction: column;
}

.player-score {
  font-size: 12px;
}

.rank {
  margin-right: 15px
}

.avatar,
.name,
.score {
  margin-right: 5px;
}

.avatar img,
.avatar .initials {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #777;
}</style>