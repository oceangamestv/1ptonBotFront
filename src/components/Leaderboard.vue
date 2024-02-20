<script lang="ts" setup>
import { useLeaderboardStore } from '@/store/leaderboard';
import { User, useUserStore } from '@/store/user';
import moment from 'moment';
import { onMounted } from 'vue';


const leaderboardStore = useLeaderboardStore()
const userStore = useUserStore()
const user = userStore.user

onMounted(() => {
    leaderboardStore.fetchLeaderboard()
})
</script>

<template>
    <div class="leaderboard">
        <div class="leaderboard-title">
            🏆 Top users
        </div>
        <div class="leaderboard-list">
            <div class="player you">
                <span class="avatar">
                    <img v-if="leaderboardStore.leaderboard?.me.avatar_url" :src="leaderboardStore.leaderboard?.me.avatar_url" :alt="leaderboardStore.leaderboard?.me.identity" />
                    <div v-else class="initials">{{ leaderboardStore.leaderboard?.me.identity?.substring(0, 2).toUpperCase() }}</div>
                </span>
                <div class="player-info">
                    <span class="name">You on {{ leaderboardStore.leaderboard?.me.position }} place</span>
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
.avatar, .name, .score {
  margin-right: 5px;
}

.avatar img, .avatar .initials {
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
}
</style>